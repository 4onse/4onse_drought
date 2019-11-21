import { Component } from 'react'
import { Button } from 'semantic-ui-react'


class ButtonGroup extends Component{
    render () {
        let { 
            selectedIndex,
            handleChange,
            fixedOverlayStyle,
            indexes
        } = this.props
        return(
            <div style={fixedOverlayStyle}>
                <Button.Group>
                    <Button
                    positive={selectedIndex == 0 ? true : false}
                    onClick={handleChange.bind(this, 0)}
                    >
                    {indexes[0]}
                    </Button>
                    <Button.Or />
                    <Button
                    positive={selectedIndex == 1 ? true : false}
                    onClick={handleChange.bind(this, 1)}
                    >
                    {indexes[1]}
                    </Button>
                    <Button.Or />
                    <Button
                    positive={selectedIndex == 2 ? true : false}
                    onClick={handleChange.bind(this, 2)}
                    >
                    {indexes[2]}
                    </Button>
                    <Button.Or />
                    <Button
                    positive={selectedIndex == 3 ? true : false}
                    onClick={handleChange.bind(this, 3)}
                    >
                    {indexes[3]}
                    </Button>
                </Button.Group>
            </div>
        )
    }
};

export default ButtonGroup;