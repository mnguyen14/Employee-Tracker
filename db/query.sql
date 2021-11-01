SELECT 
    employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary, employee.manager_id
FROM role
LEFT JOIN employee ON role.id = employee.role_id
LEFT JOIN department ON department.id = role.dapartment_id
