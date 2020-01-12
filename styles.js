import {
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';

const pallette = {
  white: '#FFFFFF',
  tabBar: '#383838',
  tabBarActive: '#880088',
  inactive: '#888888',
  inputBackground: '#FFFFFF44',
  black: '#000000',
  transparent: '#00000000',
  appBackground: '#444444',
};

const styles = StyleSheet.create({
  scrollContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    width: 100+'%',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    color: pallette.white,
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: pallette.white,
    paddingVertical: 5,
  },
  routerButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#555555',
    color: pallette.white,
    flex: 0,
  },
  tabBar: {
    backgroundColor: pallette.tabBar,
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
    color: pallette.inactive,
    fontSize: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomColor: pallette.tabBar,
    borderTopColor: pallette.tabBar,
    borderBottomWidth: 2,
    borderTopWidth: 2,
  },
  tabBarButtonActive: {
    color: pallette.white,
    fontSize: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomColor: pallette.tabBar,
    borderTopColor: pallette.tabBar,
    borderBottomWidth: 2,
    borderTopWidth: 2,
  },
  appContainer: {
    height: Dimensions.get('window').height - StatusBar.currentHeight,
    backgroundColor: pallette.appBackground,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
});

export default styles;
export { pallette };
