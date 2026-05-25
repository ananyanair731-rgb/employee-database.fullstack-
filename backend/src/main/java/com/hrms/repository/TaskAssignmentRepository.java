package com.hrms.repository;

import com.hrms.entity.TaskAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskAssignmentRepository extends JpaRepository<TaskAssignment, Long> {
    List<TaskAssignment> findByAssignedToId(Long employeeId);
    List<TaskAssignment> findByStatus(TaskAssignment.TaskStatus status);
    List<TaskAssignment> findByAssignedToIdAndStatus(Long employeeId, TaskAssignment.TaskStatus status);
}
