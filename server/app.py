# -*- coding: utf-8 -*-
# ===============================================================================
#
# Authors: Daniele Strigaro
#
# Copyright (c) 2019 IST-SUPSI (www.supsi.ch/ist)
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or (at your option)
# any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
#
# ===============================================================================

from drought import IstsosDrought
import logging
import json
import os

base_path = os.path.dirname(__file__)

# SET LOGGER
# Enable logging
LOG_INFO = os.path.join(
    base_path,
    'drought.log'
)

LOG_ERROR = os.path.join(
    base_path,
    'drought_error.log'
)

for handler in logging.root.handlers[:]:
    logging.root.removeHandler(handler)

LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'

logger = logging.getLogger(__name__)
log_formatter = logging.Formatter(LOG_FORMAT)

# comment this to suppress console output
stream_handler = logging.StreamHandler()
stream_handler.setFormatter(log_formatter)
logger.addHandler(stream_handler)

file_handler_info = logging.FileHandler(LOG_INFO, mode='a')
file_handler_info.setFormatter(log_formatter)
file_handler_info.setLevel(logging.INFO)
logger.addHandler(file_handler_info)

file_handler_error = logging.FileHandler(LOG_ERROR, mode='a')
file_handler_error.setFormatter(log_formatter)
file_handler_error.setLevel(logging.ERROR)
logger.addHandler(file_handler_error)

logger.setLevel(logging.INFO)

# LOADING CONFIGURATIONS

with open(
    os.path.join(
        base_path,
        'config.json'
        ), 'r') as f:
    conf = json.load(f)

drought = IstsosDrought(
    conf['istsos_url'],
    conf['istsos_service'],
    conf['chirps_path'],
    conf['istsos_pwd'],
    conf['istsos_user'],
    logger=logger
)
drought.get_stations()
drought.get_data()
drought.calc_spi()
