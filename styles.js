import {
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';

const pallette = {
  white: '#FFFFFF',
  tabBar: '#383838',
  inactive: '#888888'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 5,
  },
  routerButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#555555',
    color: pallette.white,
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
    borderBottomColor: '#880088',
    borderTopColor: pallette.tabBar,
    borderBottomWidth: 2,
    borderTopWidth: 2,
  },
  appContainer: {
    height: Dimensions.get('window').height - StatusBar.currentHeight,
    backgroundColor: '#444444',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
});

export default styles;
export { pallette };
