USE node_course;

-- CREATE TABLE that stores user login information
CREATE TABLE App_User
(
  User_Id           BIGINT not null,
  User_Name         VARCHAR(36) not null,
  Encryted_Password VARCHAR(128) not null,
  ENABLED           BIT not null,
  PRIMARY KEY (User_Id),
  CONSTRAINT App_User_UK unique (User_Name)
);
-- 
 
-- CREATE TABLE that stores types of app roles
CREATE TABLE App_Role
(
  Role_Id   BIGINT not null,
  Role_Name VARCHAR(30) not null,
  PRIMARY KEY (Role_Id),
  CONSTRAINT App_Role_UK unique (Role_Name)
);
--  

-- CREATE TABLE that stores all app users current role using ids
CREATE TABLE User_Roles
(
  ID      BIGINT not null,
  User_Id BIGINT not null,
  Role_Id BIGINT not null,
  PRIMARY KEY (ID),
  CONSTRAINT User_Roles_UK unique (User_Id, Role_Id),
  CONSTRAINT User_Roles_FK1 foreign key (User_Id)
  references App_User (User_Id),
  CONSTRAINT User_Roles_FK2 foreign key (Role_Id)
  references App_Role (Role_Id)
);

-- roles types
insert into App_Role (Role_Id, Role_Name)
values (1, 'Role_Admin');
 
insert into App_Role (Role_Id, Role_Name)
values (2, 'Role_User_Base');
 

--  users
insert into App_User (User_Id, User_Name, Encryted_Password, ENABLED)
values (1, 'admin1', 'password1', 1);

insert into App_User (User_Id, User_Name, Encryted_Password, ENABLED)
values (2, 'user1', 'password2', 1);
 

--- app user role TABLE
insert into User_Roles (ID, User_Id, Role_Id)
values (1, 1, 1);
 
insert into User_Roles (ID, User_Id, Role_Id)
values (2, 2, 2);

insert into User_Roles (ID, User_Id, Role_Id)
values (3, 1, 2);
 
-- Query data________________________________________________________________________________________

USE node_course;

-- Get all table data 
SELECT * FROM App_User;
SELECT * FROM App_Role;
SELECT * FROM User_Roles;

-- Get User roles by User_Id
SELECT r.Role_Name FROM User_Roles u, App_Role r WHERE u.Role_Id = r.Role_Id and u.User_Id = 1;

SELECT r.Role_Name FROM User_Roles u, App_Role r WHERE u.Role_Id = r.Role_Id and u.User_Id = 2;

-- Get user account by User_Id
SELECT u.User_Id, u.User_Name, u.Encryted_Password FROM App_User u WHERE u.User_Id = 1;

-- Get user account by User_Name
SELECT u.User_Id, u.User_Name, u.Encryted_Password FROM App_User u WHERE u.User_Name = 'user1';

-- Do active user account by User_Name(Role=admin)
UPDATE App_User SET ENABLED = 0 WHERE User_Name = 'user1';

-- Do active user account by User_Id(Role=admin)
UPDATE App_User SET ENABLED = 0 WHERE User_Id = 2;

-- Create new App_User
insert into App_User (User_Id, User_Name, Encryted_Password, ENABLED) values (1, 'admin1', 'password1', 1);

-- Update account by User_Name
UPDATE

-- Update account by User_Id
UPDATE

-- Delete user by User_Name(Role=admin)
DELETE FROM App_User WHERE User_Name = 'Name';
DELETE FROM App_User WHERE User_Id = 0;

-- Delete role by User_Id(Role=admin)
DELETE FROM App_Role WHERE ID = 2;

-- Get All User account
SELECT User_Id, User_Name FROM App_User;

-- Get All roles 
SELECT Role_Name FROM App_Role;