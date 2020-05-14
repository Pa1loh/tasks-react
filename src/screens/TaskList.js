import React, { Component } from 'react';
import { View, Text, ImageBackground, StyleSheet, 
         FlatList, TouchableOpacity, Platform } from 'react-native';

import commonStyles from '../commonStyles.js'
import todayImage from '../../assets/imgs/today.jpg';

import Icon from 'react-native-vector-icons/FontAwesome';

import moment from 'moment';
import 'moment/locale/pt-br';

import Task from '../components/Task';
import AddTask from './AddTask'

export default class TaskList extends Component {

  state = {
    showDoneTasks: true,
    visibleTasks:[],
    showAddTaskModal: true,
    tasks:[{
      id: Math.random(),
      description: 'Descricao 1',
      estimatedDate: new Date(),
      doneDate: new Date()
    }, {
      id: Math.random(),
      description: 'Descricao 2',
      estimatedDate: new Date(),
      doneDate: null
    }]
  }

  componentDidMount = () => {
    this.filterTasks();
  }

  toggleDoneTask = taskId => {
    const clonedTasks = [...this.state.tasks]

    clonedTasks.forEach(task => {
      if (task.id === taskId) {
        task.doneDate = task.doneDate ? null : new Date();
      } 
    });

    this.setState({tasks: clonedTasks}, this.filterTasks);
  }

  toggleShowDoneTask = () => {
    this.setState({showDoneTasks: !this.state.showDoneTasks}, this.filterTasks);
  }

  filterTasks = () => {
    let visibleTasks = null;

    if (this.state.showDoneTasks) {
      visibleTasks = [...this.state.tasks];
    } else {
      
      const pending = task => task.doneDate === null;

      visibleTasks = this.state.tasks.filter(pending);
    }

    this.setState({visibleTasks});
  }

  render() {
    const today = moment().locale('pt-br').format('ddd, D [de] MMMM');

    return (
      <View style={styles.container}>
        <AddTask isVisible={this.state.showAddTaskModal}
                 onCancel={() => this.setState({ showAddTaskModal: false }) }/>
        <ImageBackground source={todayImage} 
                         style={styles.background}>
          <View style={styles.iconBar}>
            <TouchableOpacity onPress={this.toggleShowDoneTask}>
              <Icon name={this.state.showDoneTasks ? 'eye' : 'eye-slash'}
                    size={20} 
                    color={commonStyles.colors.secondary}/>
            </TouchableOpacity>
          </View>
          <View style={styles.titleBar}>
            <Text style={styles.title}>
              Hoje
            </Text>
            <Text style={styles.subtitle}>
              {today}
            </Text>
          </View>
        </ImageBackground>
        <View style={styles.taskList}>
          <FlatList data={this.state.visibleTasks} 
                    keyExtractor={item => `${item.id}`} 
                    renderItem={(obj) => <Task {...obj.item} 
                    toggleDoneTask={this.toggleDoneTask} />} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 3,
  },
  taskList: {
    flex: 7
  },
  titleBar: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    color:  commonStyles.colors.secondary,
    fontSize: 50,
    marginLeft: 20,
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: commonStyles.fontFamily,
    color:  commonStyles.colors.secondary,
    fontSize: 20,
    marginLeft: 20,
    marginBottom: 30,
  },
  iconBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'flex-end',
    marginTop: Platform.OS === 'ios' ? 50 : 20
  }
});
