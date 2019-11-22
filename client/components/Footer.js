import Link from 'next/link';
import {
    Container,
    Segment,
    List,
} from 'semantic-ui-react'


const Footer = (props) => (
  <div>
    <Segment inverted vertical style={{padding: 3}}>
      <Container textAlign='center' style={props.footerStyle}>
        <List horizontal inverted divided link >
          <List.Item>
            <Link href="/drought">
              <a>Home</a>
            </Link>
          </List.Item>
          <List.Item as='a' href='http://4onse.ch' target='_black'>
            Contact Us
          </List.Item>
          <List.Item>
            <Link href="/drought/about" >
              <a>Terms and Conditions</a>
            </Link>
          </List.Item>
        </List>
      </Container>
    </Segment>
  </div>
);

export default Footer;
