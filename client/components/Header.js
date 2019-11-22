import Link from 'next/link';
import Head from 'next/head'
import {
    Container,
    Image,
    Menu,
} from 'semantic-ui-react'


const Header = (props) => (
  <div>
    <Head>
        <title>{props.title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
        <link rel="stylesheet" href="/drought/static/semantic/semantic.min.css" />
        <link rel="stylesheet" href="/drought/static/leaflet/leaflet.css" />
        <script src="/drought/static/leaflet/leaflet.js"></script>
        <script src="/drought/static/echarts/echarts.min.js"></script>
        {/* <script src="/static/lib/echarts/echarts.js"></script>} */}
    </Head>
    <Menu
        borderless
        fixed={'top'}
        style={props.barStyle}
    >
        <Container text>
        <Menu.Item>
            <Image size='mini' src='/drought/static/logo.svg' />
        </Menu.Item>
        <Menu.Item header>4onse - Drought monitoring system</Menu.Item>
        </Container>
    </Menu>
  </div>
);

export default Header;
