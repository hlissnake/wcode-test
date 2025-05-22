import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskComponent from './Task';
import { Task } from '../types/Task';

describe('TaskComponent', () => {
  const mockTask: Task = {
    id: '1',
    name: 'Test Task',
    timeSpent: 0,
    isActive: false
  };

  const onUpdateActive = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task name and formatted time', () => {
    render(
      <TaskComponent
        task={mockTask}
        onUpdateActive={onUpdateActive}
      />
    );
    expect(screen.getByTestId('task-name')).toHaveTextContent('Name: Test Task');
    expect(screen.getByTestId('task-time-spent')).toHaveTextContent('Time Spent: 00:00:00');
    expect(screen.getByTestId('task-button')).toHaveTextContent('Start');
  });

  it('calls onUpdateActive with correct arguments when button is clicked', () => {
    render(
      <TaskComponent
        task={mockTask}
        onUpdateActive={onUpdateActive}
      />
    );
    fireEvent.click(screen.getByTestId('task-button'));
    expect(onUpdateActive).toHaveBeenCalledWith('1', true);
  });

  it('shows Stop when task is active', () => {
    render(
      <TaskComponent
        task={{ ...mockTask, isActive: true }}
        onUpdateActive={onUpdateActive}
      />
    );
    expect(screen.getByTestId('task-button')).toHaveTextContent('Stop');
  });
});