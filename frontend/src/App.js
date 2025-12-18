import React, { useState, useEffect } from 'react';
import { Layout, Typography, Button, Form, Input, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Task from './components/Task';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      message.error('Failed to fetch tasks');
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async (values) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      if (response.ok) {
        const newTask = await response.json();
        setTasks([newTask, ...tasks]);
        message.success('Task added successfully');
        form.resetFields();
        setIsModalVisible(false);
      } else {
        throw new Error('Failed to add task');
      }
    } catch (error) {
      message.error('Failed to add task');
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      
      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        ));
        message.success('Task updated successfully');
      } else {
        throw new Error('Failed to update task');
      }
    } catch (error) {
      message.error('Failed to update task');
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId));
        message.success('Task deleted successfully');
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      message.error('Failed to delete task');
      console.error('Error deleting task:', error);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <Title level={3} style={{ color: 'white', margin: 0 }}>Task Manager</Title>
      </Header>
      
      <Content className="app-content">
        <div className="task-actions">
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showModal}
          >
            Add Task
          </Button>
        </div>
        
        <div className="task-list">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <Task 
                key={task.id} 
                task={task} 
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            ))
          ) : (
            <div className="empty-state">
              <p>No tasks yet. Add your first task to get started!</p>
            </div>
          )}
        </div>
      </Content>

      <Modal
        title="Add New Task"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddTask}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={4} placeholder="Enter task description" />
          </Form.Item>
          
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Add Task
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default App;
