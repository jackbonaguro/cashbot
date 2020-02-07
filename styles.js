import {
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';

const palette = {
  white: '#FFFFFF',
  tabBar: '#383838',
  tabBarActive: '#880088',
  inactive: '#888888',
  inputBackground: '#FFFFFF44',
  black: '#000000',
  transparent: '#00000000',
  appBackground: '#444444',
  purple: '#880088',
};

const styles = StyleSheet.create({
  scrollContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    width: 100+'%',
  },
  shadowView: {
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    //
    // elevation: 5,
    backgroundColor: palette.tabBar
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    color: palette.white,
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: palette.white,
    paddingVertical: 5,
  },
  routerButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#555555',
    color: palette.white,
    flex: 0,
  },
  tabBar: {
    backgroundColor: palette.tabBar,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 55,
  },
  tabBarLink: {
    paddingHorizontal: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarButton: {
    color: palette.inactive,
    fontSize: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomColor: palette.tabBar,
    borderTopColor: palette.tabBar,
    borderBottomWidth: 2,
    borderTopWidth: 2,
  },
  tabBarButtonActive: {
    color: palette.white,
    fontSize: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomColor: palette.tabBar,
    borderTopColor: palette.tabBar,
    borderBottomWidth: 2,
    borderTopWidth: 2,
  },
  appContainer: {
    height: Dimensions.get('window').height - StatusBar.currentHeight,
    backgroundColor: palette.appBackground,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
});

export default styles;
export { palette };
