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
  }
});

export default styles;
export { pallette };
