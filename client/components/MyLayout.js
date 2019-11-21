// components/MyLayout.js

import Header from './Header';
import Footer from './Footer';
import {
    BrowserView,
    MobileView
} from "react-device-detect";


const Layout = props => (
  <div>
    <Header title={props.title} barStyle={props.barStyle}/>
    <BrowserView>
      {props.content}
      <Footer footerStyle={props.footerStyle}/>
    </BrowserView>
    <MobileView>sono un mobile</MobileView>
  </div>
);

export default Layout;
