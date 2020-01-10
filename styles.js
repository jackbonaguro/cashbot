import { StyleSheet, Dimensions } from 'react-native';

const pallette = {
  white: '#FFFFFF',
  tabBar: '#383838',
  tabBarHighlight: '#8800BB88',
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
    alignItems: 'stretch',
    minHeight: 55,
  },
  tabBarLink: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarButton: {
    color: pallette.white,
    fontSize: 16,
    padding: 10,
    borderRadius: 25,
  },
  appContainer: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: '#444444',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
});

export default styles;
export { pallette };
