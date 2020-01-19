import React, { Component } from 'react'
import { WebView } from 'react-native'

export default class BackgroundTaskRunner extends Component {
  render() {
    return (
      <WebView
        ref={el => this.webView = el}
        source={{html: '<html><body></body></html>'}}
        onMessage={this.handleMessage}
      />
    )
  }
  runJSInBackground (code) {
    this.webView.injectJavaScript(code);
  }
  handleMessage = (e) => {
    const message = e.nativeEvent.data;
    console.log('message from webview:', message);
  }
};
