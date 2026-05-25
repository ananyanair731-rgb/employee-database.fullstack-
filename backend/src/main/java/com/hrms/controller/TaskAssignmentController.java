package com.hrms.controller;

import com.hrms.dto.ApiResponse;
import com.hrms.entity.TaskAssignment;
import com.hrms.service.TaskAssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskAssignmentController {

    @Autowired
    private TaskAssignmentService taskService;

    /**
     * POST /api/tasks/employee/{employeeId}/assign
     * Assign a task to an employee
     */
    @PostMapping("/employee/{employeeId}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER')")
    public ResponseEntity<?> assignTask(@PathVariable Long employeeId,
                                         @RequestBody TaskAssignment task) {
        TaskAssignment created = taskService.assignTask(employeeId, task);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Task assigned successfully!", created));
    }

    /**
     * GET /api/tasks
     * Get all tasks
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER')")
    public ResponseEntity<?> getAllTasks() {
        List<TaskAssignment> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(new ApiResponse(true, "Tasks found", tasks));
    }

    /**
     * GET /api/tasks/{id}
     * Get task by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<?> getTaskById(@PathVariable Long id) {
        TaskAssignment task = taskService.getTaskById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Task found", task));
    }

    /**
     * GET /api/tasks/employee/{employeeId}
     * Get tasks for a specific employee
     */
    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<?> getTasksByEmployee(@PathVariable Long employeeId) {
        List<TaskAssignment> tasks = taskService.getTasksByEmployee(employeeId);
        return ResponseEntity.ok(new ApiResponse(true, "Tasks for employee", tasks));
    }

    /**
     * PUT /api/tasks/{id}/status
     * Update task status
     * Body: { "status": "IN_PROGRESS" }
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<?> updateTaskStatus(@PathVariable Long id,
                                               @RequestBody Map<String, String> body) {
        String status = body.get("status");
        TaskAssignment updated = taskService.updateTaskStatus(id, status);
        return ResponseEntity.ok(new ApiResponse(true, "Task status updated!", updated));
    }

    /**
     * PUT /api/tasks/{id}
     * Update task details
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER')")
    public ResponseEntity<?> updateTask(@PathVariable Long id,
                                         @RequestBody TaskAssignment task) {
        TaskAssignment updated = taskService.updateTask(id, task);
        return ResponseEntity.ok(new ApiResponse(true, "Task updated!", updated));
    }

    /**
     * DELETE /api/tasks/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(new ApiResponse(true, "Task deleted!"));
    }
}
