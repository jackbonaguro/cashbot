import { StyleSheet } from 'react-native';

const pallette = {
  white: '#FFFFFF',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5ECFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  routerButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#555555',
    color: pallette.white,
  },
  tabBar: {
    backgroundColor: pallette.white,
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
    color: '#55CC55',
    fontSize: 16,
  },
  appContainer: {
    backgroundColor: '#444444',
    flex: 1,
    flexDirection: 'column-reverse',
    alignItems: 'center',
  },
});

export default styles;
export { pallette };
