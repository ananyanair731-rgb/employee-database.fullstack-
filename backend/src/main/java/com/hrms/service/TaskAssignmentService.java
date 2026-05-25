package com.hrms.service;

import com.hrms.entity.Employee;
import com.hrms.entity.TaskAssignment;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.EmployeeRepository;
import com.hrms.repository.TaskAssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskAssignmentService {

    @Autowired
    private TaskAssignmentRepository taskRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public TaskAssignment assignTask(Long employeeId, TaskAssignment task) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + employeeId));
        task.setAssignedTo(employee);
        task.setStatus(TaskAssignment.TaskStatus.ASSIGNED);
        return taskRepository.save(task);
    }

    public List<TaskAssignment> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<TaskAssignment> getTasksByEmployee(Long employeeId) {
        return taskRepository.findByAssignedToId(employeeId);
    }

    public TaskAssignment getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + id));
    }

    public TaskAssignment updateTaskStatus(Long taskId, String status) {
        TaskAssignment task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + taskId));

        try {
            TaskAssignment.TaskStatus taskStatus = TaskAssignment.TaskStatus.valueOf(status.toUpperCase());
            task.setStatus(taskStatus);
            if (taskStatus == TaskAssignment.TaskStatus.COMPLETED) {
                task.setCompletedAt(LocalDateTime.now());
            }
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
        return taskRepository.save(task);
    }

    public TaskAssignment updateTask(Long id, TaskAssignment updated) {
        TaskAssignment existing = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + id));
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setDueDate(updated.getDueDate());
        existing.setPriority(updated.getPriority());
        if (updated.getStatus() != null) existing.setStatus(updated.getStatus());
        return taskRepository.save(existing);
    }

    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task not found: " + id);
        }
        taskRepository.deleteById(id);
    }
}
