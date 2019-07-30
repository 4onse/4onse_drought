# -*- coding: utf-8 -*-
# ===============================================================================
#
# Authors: Daniele Strigaro
#
# Copyright (c) 2019 IST-SUPSI (www.supsi.ch/ist)
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc.,
# 51 Franklin Street, Fifth Floor,
# Boston, MA  02110-1301  USA
#
# ===============================================================================

import os
import pandas as pd
import requests
from dateutil import parser
from datetime import datetime, time, timedelta, timezone
import pytz
import logging
from lib import compute
from pyproj import Proj, transform
import netCDF4
import numpy as np
import json
import csv
try:
    from StringIO import StringIO
except ImportError:
    from io import StringIO

from climate_indices.indices import Distribution, spi
from climate_indices import compute


class IstsosDrought:
    def __init__(
        self, base_url, service, chirps_path,
        pwd=None, user=None, out_proj='epsg:4326',
        spi_prefix='SPI_', base_path=None
    ):
        self.base_url = base_url.strip('/')
        self.service = service
        self.pwd = pwd
        self.user = user
        self.basic_auth = (
            self.user,
            self.pwd
        )
        self.chirps_path = chirps_path
        self.stations = []
        self.spi_prefix = spi_prefix
        self.interval = timedelta(days=15)
        self.outProj = out_proj
        if base_path:
            self.base_path = base_path
        else:
            self.base_path = os.path.dirname(os.path.abspath(__file__))

        ##################
        # SETTING LOGGER #
        ##################

        LOG_INFO = os.path.join(
            self.base_path,
            'log.txt'
        )

        LOG_ERROR = '{}/error.txt'.format(
            self.base_path,
            'error.txt'
        )

        for handler in logging.root.handlers[:]:
            logging.root.removeHandler(handler)

        LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'

        self.logger = logging.getLogger(__name__)
        log_formatter = logging.Formatter(LOG_FORMAT)

        # comment this to suppress console output
        stream_handler = logging.StreamHandler()
        stream_handler.setFormatter(log_formatter)
        stream_handler.setLevel(logging.INFO)
        self.logger.addHandler(stream_handler)

        file_handler_info = logging.FileHandler(LOG_INFO, mode='a')
        file_handler_info.setFormatter(log_formatter)
        file_handler_info.setLevel(logging.INFO)
        self.logger.addHandler(file_handler_info)

        file_handler_error = logging.FileHandler(LOG_ERROR, mode='a')
        file_handler_error.setFormatter(log_formatter)
        file_handler_error.setLevel(logging.ERROR)
        self.logger.addHandler(file_handler_error)

        self.logger.setLevel(logging.INFO)

    def get_stations(self):
        ##################
        # QUERY STATIONS #
        ##################
        url_get_list = (
            "{}/wa/istsos/services/{}/"
            "procedures/operations/getlist"
        ).format(self.base_url, self.service)
        r = requests.get(
            url_get_list,
            auth=self.basic_auth
        )
        res = r.json()
        if res['success']:
            res_data = res['data']
            for row in res_data:
                if self.spi_prefix in row['name']:
                    self.stations.append(
                        {
                            'name': row['name'],
                            'source': 'istsos',
                            'base_url': self.base_url,
                            'istsos_service': self.service,
                            'istsos_user': self.user,
                            'istsos_pwd': self.pwd,
                            'chirps': True
                        }
                    )
        else:
            self.logger.error(
                "Error: CANNOT QUERY STATIONS"
            )

    def from_istsos(
        self, begin, end, station
    ):
        next_start = begin
        end_datetime = end

        data_txt = ''
        uri = (
            '{}/{}'
        ).format(
            self.base_url,
            self.service
        )
        while end_datetime >= next_start:
            if (next_start == end_datetime):
                break
            else:
                stop_time = next_start + self.interval
                event_time = '{}/{}'.format(
                    next_start.isoformat(), stop_time.isoformat()
                )
                go_parameters = {
                    'service': 'SOS',
                    'version': '1.0.0',
                    'request': 'GetObservation',
                    'offering': 'temporary',
                    'aggregateFunction': 'SUM',
                    'aggregateInterval': 'P1D',
                    'procedure': station['name'][4:],
                    'observedProperty': (
                        'urn:ogc:def:parameter:x-istsos:1.0:'
                        'meteo:air:rainfall'
                    ),
                    'eventTime': event_time,
                    'qualityIndex': 'True',
                    'responseFormat': 'text/plain'
                }
                r = requests.get(
                    uri,
                    params=go_parameters,
                    auth=(station['istsos_user'], station['istsos_pwd'])
                )
                if 'html' in r.text or 'Exception' in r.text:
                    r = requests.get(
                        uri,
                        params=go_parameters,
                        auth=(station['istsos_user'], station['istsos_pwd'])
                    )
                    if 'html' in r.text or 'Exception' in r.text:
                        logger.error(
                            "{}: {}".format(
                                station['name'],
                                r.text
                            )
                        )
                        break
                else:
                    header_end = r.text.find('\n')
                    header = r.text[:header_end+1]
                    data_txt = data_txt + r.text[header_end+1:]
                    r.close()
            if (next_start + self.interval) > end_datetime:
                next_start = end_datetime
            else:
                next_start += self.interval
        return header + data_txt

    def get_data(self):
        ##############
        # QUERY DATA #
        ##############
        for station in self.stations:
            file_name = os.path.join(
                self.base_path,
                'data',
                '{}.txt'.format(station['name'][4:])
            )
            data_path = os.path.join(
                self.base_path,
                'data'
            )

            if '{}.txt'.format(station['name'][4:]) in os.listdir(data_path):
                with open(file_name) as f:
                    station['ts'] = pd.read_csv(
                        header=0,
                        skiprows=None,
                        comment='#',
                        na_values=[
                            -999, None,
                            'None', -999.9
                        ],
                        dayfirst=False,
                        parse_dates=[0],
                        filepath_or_buffer=f,
                        sep=',',
                        index_col=0,
                    )
                    station['ts'].index = (
                        station['ts'].index - pd.DateOffset(days=1)
                    )
                    station['ts'] = station['ts'].rename(
                        index={
                            'urn:ogc:def:parameter:x-istsos:1.0:time:iso8601': 'time'
                        },
                        columns={
                            "urn:ogc:def:parameter:x-istsos:1.0:meteo:air:rainfall": "rain",
                            "urn:ogc:def:parameter:x-istsos:1.0:meteo:air:rainfall:qualityIndex": "qi"
                        }
                    )
                uri = '{}/wa/istsos/services/{}/procedures/{}'.format(
                    station['base_url'],
                    station['istsos_service'],
                    station['name'][4:]
                )
                r = requests.get(
                    uri, auth=(
                        station['istsos_user'],
                        station['istsos_pwd']
                    )
                )
                metadata = r.json()['data']
                r.close()
                end_source = parser.parse(
                    metadata['outputs'][0]['constraint']['interval'][1]
                ).replace(tzinfo=timezone.utc)
                end_store = station['ts'].index[-1].replace(
                    tzinfo=timezone.utc
                )
                # self.logger.info(
                #     end_store - end_source
                # )

                if (end_store - end_source) < timedelta(days=0):
                    self.logger.info(
                        'UPDATE'
                    )
                    self.logger.info(
                        "UPDATING {} DATA: {} - {}".format(
                            station['name'][4:],
                            end_store.isoformat(),
                            end_source.isoformat()
                        )
                    )
                    istsos_data_txt = self.from_istsos(
                        end_store,
                        end_source,
                        station
                    )
                    with open(
                        os.path.join(
                            self.base_path,
                            'data',
                            '{}.txt'.format(station['name'][4:])), "r") as f:
                        csv_read = csv.reader(
                            f,
                            delimiter=','
                        )
                        next(csv_read)
                        csv_read2 = csv.reader(
                            StringIO(istsos_data_txt),
                            delimiter=','
                        )
                        next(csv_read2)
                        update_rows = []
                        for row2 in csv_read2:
                            update = True
                            for row in csv_read:
                                if row[0] == row2[0]:
                                    update = False
                            if update:
                                update_rows.append(row2)
                    if update:
                        self.logger.info(update_rows)
                        with open(
                            os.path.join(
                                self.base_path,
                                'data',
                                '{}.txt'.format(station['name'][4:])),
                                "a") as f:
                            for row in update_rows:
                                f.write(
                                    '\n' + ','.join(row)
                                )
            else:
                self.logger.info(
                    "GET DATA FROM {}".format(
                        station['name'][4:]
                    )
                )
                uri = '{}/wa/istsos/services/{}/procedures/{}'.format(
                    station['base_url'],
                    station['istsos_service'],
                    station['name'][4:]
                )
                r = requests.get(
                    uri, auth=(
                        station['istsos_user'],
                        station['istsos_pwd']
                    )
                )
                metadata = r.json()['data']
                r.close()
                if 'constraint' in metadata['outputs'][0]:
                    begin_date = parser.parse(
                        metadata['outputs'][0]['constraint']['interval'][0]
                    ).date()
                    begin_datetime = datetime.combine(
                        begin_date,
                        datetime.min.time()
                    ).replace(tzinfo=pytz.utc)
                    end_datetime = parser.parse(
                        metadata['outputs'][0]['constraint']['interval'][1]
                    ).replace(tzinfo=pytz.utc)
                    self.logger.info(
                        "LOADING DATA {}: {} - {}".format(
                            station['name'][4:],
                            begin_datetime.isoformat(),
                            end_datetime.isoformat()
                        )
                    )
                    next_start = begin_datetime

                    data_txt = ''
                    uri = (
                        '{}/{}'
                    ).format(
                        station['base_url'],
                        station['istsos_service']
                    )

                    while end_datetime >= next_start:
                        if (next_start == end_datetime):
                            break
                        else:
                            stop_time = next_start + self.interval
                            event_time = '{}/{}'.format(
                                next_start.isoformat(), stop_time.isoformat()
                            )
                            go_parameters = {
                                'service': 'SOS',
                                'version': '1.0.0',
                                'request': 'GetObservation',
                                'offering': 'temporary',
                                'aggregateFunction': 'SUM',
                                'aggregateInterval': 'P1D',
                                'procedure': station['name'][4:],
                                'observedProperty': (
                                    'urn:ogc:def:parameter:x-istsos:1.0:'
                                    'meteo:air:rainfall'
                                ),
                                'eventTime': event_time,
                                'qualityIndex': 'True',
                                'responseFormat': 'text/plain'
                            }
                            r = requests.get(
                                uri,
                                params=go_parameters,
                                auth=(
                                    station['istsos_user'],
                                    station['istsos_pwd']
                                )
                            )
                            if 'html' in r.text or 'Exception' in r.text:
                                r = requests.get(
                                    uri,
                                    params=go_parameters,
                                    auth=(
                                        station['istsos_user'],
                                        station['istsos_pwd']
                                    )
                                )
                                if 'html' in r.text or 'Exception' in r.text:
                                    self.logger.error(
                                        "{}: {}".format(
                                            station['name'][4:],
                                            r.text
                                        )
                                    )
                                    break
                            else:
                                header_end = r.text.find('\n')
                                header = r.text[:header_end+1]
                                data_txt = data_txt + r.text[header_end+1:]
                                r.close()
                        if (next_start + self.interval) > end_datetime:
                            next_start = end_datetime
                        else:
                            next_start += self.interval
                    station['data_txt'] = header + data_txt
                    self.logger.info(
                        "{} DATA LOADED".format(station['name'])
                    )
                    with open('data/{}.txt'.format(
                            station['name'][4:]), "w") as f:
                        f.write(station['data_txt'])
                        f.close()
                    with open('data/{}.txt'.format(station['name'][4:])) as f:
                        station['ts'] = pd.read_csv(
                            header=0,
                            skiprows=None,
                            comment='#',
                            na_values=[-999, None, 'None', -999.9],
                            dayfirst=False,
                            parse_dates=[0],
                            filepath_or_buffer=f,
                            sep=',',
                            index_col=0,
                        )
                        station['ts'].index = (
                            station['ts'].index - pd.DateOffset(days=1)
                        )
                        station['ts'] = station['ts'].rename(
                            index={
                                (
                                    "urn:ogc:def:parameter:x-istsos:1.0:"
                                    "time:iso8601"
                                ): "time"
                            },
                            columns={
                                (
                                    "urn:ogc:def:parameter:x-istsos:1.0:"
                                    "meteo:air:rainfall"
                                ): "rain",
                                (
                                    "urn:ogc:def:parameter:x-istsos:1.0:"
                                    "meteo:air:rainfall:qualityIndex"
                                ): "qi"
                            }
                        )
                else:
                    self.logger.info(station['ts'][-1])

    def format_value(self, y):
        if y == 'nan':
            return '-999.99'
        else:
            try:
                value_ = str(y.round(2))
            except:
                value_ = str(y)

            return value_

    def calc_spi(self):
        chirps_files = sorted(os.listdir(self.chirps_path))
        for station in self.stations:
            uri = '{}/wa/istsos/services/{}/procedures/{}'.format(
                station['base_url'],
                station['istsos_service'],
                station['name']
            )
            r = requests.get(
                uri, auth=(
                    station['istsos_user'],
                    station['istsos_pwd']
                )
            )
            station['metadata'] = r.json()['data'] 
            r.close()
            precipitation = None
            total_days = 0
            i_proc = 0
            i = 0
            try:
                self.logger.info(
                    "MERGING CHIRPS AND {} STATION DATA".format(
                        station['name']
                    )
                )
                i_stat = i
                if (
                    station['metadata']['location']['crs'][
                        'properties']['name'].lower() != self.outProj):
                    # inProj = Proj(
                    #     init=station['metadata']['location'][
                    #         'crs']['properties']['name'].lower()
                    # ) NOT WORKING CHECK SCRIPT WHERE DATA UPLOAD
                    inProj = 'epsg:4326'
                    outProj_ = Proj(init=self.outProj)
                    x1 = float(
                        station['metadata']['location'][
                            'geometry']['coordinates'][0]
                    )
                    y1 = float(
                        station['metadata']['location'][
                            'geometry']['coordinates'][1]
                    )
                    lon, lat = transform(
                        inProj, self.outProj, x1, y1
                    )
                else:
                    lat = float(
                        station['metadata']['location'][
                            'geometry']['coordinates'][1]
                    )
                    lon = float(
                        station['metadata']['location'][
                            'geometry']['coordinates'][0]
                    )

                lat_inds = []
                lon_inds = []
                for chirp_file in chirps_files:
                    file_path = os.path.join(
                        self.chirps_path,
                        chirp_file
                    )
                    if 'v2.0' in file_path:
                        f = netCDF4.Dataset(file_path)
                        lats = f.variables['latitude'][:]
                        lons = f.variables['longitude'][:]
                        res_deg = 0.05
                        if not lat_inds or not lon_inds:
                            while(True):
                                lat_inds = np.where(
                                    (
                                        lats >= lat-res_deg
                                    ) & (
                                        lats <= lat+res_deg
                                    )
                                )
                                if len(lat_inds[0]) == 1:
                                    break
                                else:
                                    res_deg -= 0.005
                            res_deg = 0.05
                            while(True):
                                lon_inds = np.where(
                                    (
                                        lons >= lon-res_deg
                                    ) & (
                                        lons <= lon+res_deg
                                    )
                                )
                                if len(lon_inds[0]) == 1:
                                    break
                                else:
                                    res_deg -= 0.005

                        n_year_prec = f.variables['precip'][
                            :, lat_inds[0][0], lon_inds[0][0]
                        ].data

                        if precipitation is None:
                            precipitation = n_year_prec
                        else:
                            precipitation = np.append(
                                precipitation,
                                n_year_prec
                            )
                day_tmp = datetime.strptime('1981-1-1', '%Y-%m-%d')
                days = []
                for i in range(len(precipitation)):
                    days.append(day_tmp)
                    day_tmp = day_tmp + timedelta(days=1)

                pd_index = pd.Index(days)
                df = pd.DataFrame(
                    precipitation,
                    columns=["rain_chirps"],
                    index=pd_index
                )
                station['ts'].index = station['ts'].index.date
                new_df = df.merge(
                    station['ts'][:],
                    how='outer',
                    right_index=True,
                    left_index=True
                )

                max_rain_limit = df['rain_chirps'].max() + (
                    df['rain_chirps'].max()/2
                )

                new_df.loc[
                    pd.isnull(new_df['rain']),
                    'qi'
                ] = 150

                new_df.loc[
                    pd.isnull(new_df['rain']),
                    'rain'
                ] = new_df['rain_chirps']

                new_df.loc[
                    new_df['rain'] > max_rain_limit,
                    'rain'
                ] = new_df['rain_chirps']

                new_df.loc[
                    pd.isnull(
                        new_df['rain']
                    ) & pd.isnull(
                        new_df['rain_chirps']
                    ),
                    'qi'
                ] = 100

                new_df.loc[
                    pd.isnull(
                        new_df['rain']
                    ) & pd.isnull(
                        new_df['rain_chirps']
                    ),
                    'rain'
                ] = 0
                self.logger.info(
                    "SPI ELABORATION --> {}".format(
                        station['name']
                    )
                )
                station['spi30'] = {
                    'data': spi(
                        new_df['rain'].values,
                        30,
                        Distribution.pearson,
                        1981,
                        1981,
                        new_df.index[-1].year-1,
                        compute.Periodicity.daily
                    ),
                    'index': new_df.index
                }

                indexes_values = station['spi30']['index'].strftime(
                    "%Y-%m-%dT00:00:00+0000").tolist()

                spi30_values = list(
                    map(
                        lambda x: self.format_value(x),
                        station['spi30']['data'].tolist()
                    )
                )

                station['spi60'] = {
                    'data': spi(
                        new_df['rain'].values,
                        60,
                        Distribution.pearson,
                        1981,
                        1981,
                        new_df.index[-1].year-1,
                        compute.Periodicity.daily
                    ),
                    'index': new_df.index
                }

                spi60_values = list(
                    map(
                        lambda x: self.format_value(x),
                        station['spi60']['data'].tolist()
                    )
                )
                try:
                    # Load of a getobservation template from destination
                    res = requests.get(
                        (
                            "{}/wa/istsos/services/{}/operations/"
                            "getobservation/offerings/temporary/procedures/"
                            "{}/observedproperties/:/eventtime/"
                            "last?qualityIndex=False"
                        ).format(
                            station['base_url'],
                            station['istsos_service'],
                            station['name']
                        ),
                        params={
                            "qualityIndex": False
                        },
                        auth=self.basic_auth
                    )
                    dtemplate = res.json()['data'][0]
                    res.close()
                    data_array = []
                    for i in range(len(indexes_values)):
                        data_array.append([
                            indexes_values[i], spi30_values[i], spi60_values[i]
                        ])

                    dtemplate['result'][
                        'DataArray']['elementCount'] = str(len(data_array))
                    dtemplate['result']['DataArray']['values'] = data_array
                    dtemplate["samplingTime"] = {}

                    dtemplate["samplingTime"][
                        "beginPosition"] = indexes_values[0]
                    dtemplate["samplingTime"][
                        "endPosition"] = indexes_values[-1]
                    # print(dtemplate['samplingTime'])

                    # POST data to WA
                    res = requests.post((
                            "{}/wa/istsos/services/"
                            "{}/operations/insertobservation"
                        ).format(
                            station['base_url'],
                            station['istsos_service']
                        ),
                        auth=self.basic_auth,
                        verify=True,
                        data=json.dumps({
                            "ForceInsert": 'true',
                            "AssignedSensorId": station[
                                'metadata']['assignedSensorId'],
                            "Observation": dtemplate
                        })
                    )

                    res_json = res.json()
                    res.close()
                    if res_json['success']:
                        self.logger.info(
                            'SPI UPLOADED TO ISTSOS'
                        )
                    else:
                        self.logger.error(
                            res_json
                        )
                    
                except Exception as e:
                    msg = (
                        "Error during %s GO syncing: %s" % (
                            station['name'],
                            str(e)
                        )
                    )
                    self.logger.error(msg)
            except Exception as e:
                self.logger.error(
                    "ERROR {} --> {}".format(
                        station['name'],
                        str(e)
                    )
                )
