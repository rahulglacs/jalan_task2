import React, { useState } from 'react';
import { Card, Button, Form, Input, Checkbox } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const Task = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = () => {
    form.setFieldsValue({
      title: task.title,
      description: task.description || '',
      completed: task.completed
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await onUpdate(task.id, values);
      setIsEditing(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleToggleComplete = async (e) => {
    await onUpdate(task.id, { completed: e.target.checked });
  };

  if (isEditing) {
    return (
      <Card className="task-card" style={{ marginBottom: 16 }}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="Task title" />
          </Form.Item>
          <Form.Item name="description">
            <TextArea rows={3} placeholder="Task description" />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={handleCancel} icon={<CloseOutlined />}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleSave} icon={<CheckOutlined />}>
              Save
            </Button>
          </div>
        </Form>
      </Card>
    );
  }

  return (
    <Card 
      className="task-card" 
      style={{ 
        marginBottom: 16,
        backgroundColor: task.completed ? '#f6ffed' : 'white'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <Checkbox 
          checked={task.completed} 
          onChange={handleToggleComplete}
          style={{ marginTop: 4, marginRight: 12 }}
        />
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            margin: '0 0 8px 0',
            textDecoration: task.completed ? 'line-through' : 'none',
            color: task.completed ? '#8c8c8c' : 'inherit'
          }}>
            {task.title}
          </h3>
          {task.description && (
            <p style={{ 
              margin: 0,
              color: task.completed ? '#8c8c8c' : '#666',
              whiteSpace: 'pre-line'
            }}>
              {task.description}
            </p>
          )}
          <div style={{ marginTop: 12, fontSize: '0.85em', color: '#8c8c8c' }}>
            {new Date(task.created_at).toLocaleString()}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={handleEdit}
            disabled={task.completed}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => onDelete(task.id)}
          />
        </div>
      </div>
    </Card>
  );
};

export default Task;
