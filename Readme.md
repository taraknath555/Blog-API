BLOG API

Build using : Node.js, Express.js, MongoDB, NPM

Resources :
Blogs --> Only writer can create a blogs. All the writer information for
aparticular blog are feded in blog resources itself. Also only have Author(Creater Writer)admin, super-admin access to modify or delete the blog.

        Users -->   There are two types of Users [admin, 'writer']

                    All the Users resources JWT authenrication is implemented so that to access any of the protected end point must have to add Authentication --> Bearer Token to test the API.

Note-1 : For every resource API features of filter, sort, pagination, fields are implemented for that just have to attach some query string in below specified format to the request url

Ex: api/v1/blogs?ratingsAverage[gte]=4.5

All implemented end points:
Note: Only 1 Super-Admin(Created with DB interface)
--> Can login as super-admin and do whatever(All access)
email: sadmin1@gmail.com
password: test1234

Tours : 1. Get All Blogs 2. Create new Blog(only writer) 3. Get one single Blog 4. Update Blog(Author, Admin, super-admin) 5. Delete Blog(Author, Admin, super-admin) 6. Approve Blogs(Only by Admin, super-Admin)

Users : 1. Get All users(only admin,super-admin access) 2. Get One user(only admin,super-admin access) 3. Update user(only admin,super-admin access) 4. Delete user(only admin,super-admin access) 5. Get current user(only authenticated user) 6. Update current user (only authenticated user) 7. Delete current user (only authenticated user) --> Not actually deleted
but inactive(Soft delete) 8. Approve Admins (Only by super-admin)

Authentication: 1. Signup 2. Login
