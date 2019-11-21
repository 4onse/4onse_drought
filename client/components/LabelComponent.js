import {Component} from 'react'
import {Label, Icon} from 'semantic-ui-react'


class LabelComponent extends Component{
    render() {
        let {
            stationsList,
            onLabelClick
        } = this.props
        return(
            <div>
                {stationsList.map(
                (item, index) => <Label onClick={onLabelClick.bind(this, index)} key={`lb-stat-key-${index}`} as='a'>
                    {item.name}
                    <Icon name='delete' />
                </Label>
                )}
            </div>
        )
    }
};

export default LabelComponent;