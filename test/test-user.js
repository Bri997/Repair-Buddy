const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, runServer, closeServer } = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

describe("Blog Post", function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });
});

it("should GET the user", function() {
  return chai
    .request(app)
    .get("/user")
    .then(function(res) {
      expect(res).to.have.status(200);
    });
});

// it("shoud add a blog post on POST", function() {
//   const newBlogPost = {
//     title: "A test title",
//     content: "Some test content",
//     author: "A Test Author"
//   };
//   return chai
//     .request(app)
//     .post("/blog-post")
//     .send(newBlogPost)
//     .then(function(res) {
//       expect(res).to.have.status(201);
//       expect(res).to.be.json;
//     });
// });

// it("should fail when POST missing title, content, or author", function() {
//   const newBlogPost = {
//     content: "Missing title",
//     author: "Missing Title"
//   };
//   return chai
//     .request(app)
//     .post("/blog-post")
//     .send(newBlogPost)
//     .then(function(res) {
//       expect(res).to.have.status(400);
//     });
// });

// it("should delete a post", function() {
//   return chai
//     .request(app)
//     .get("/blog-post")
//     .then(function(res) {
//       return chai.request(app).delete(`/blog-post/${res.body[0].id}`);
//     })
//     .then(function(res) {
//       expect(res).to.have.status(204);
//     });
// });

// it("should upate a blog post on PUT", function() {
//   return chai
//     .request(app)

//     .get("/blog-post")
//     .then(function(res) {
//       const updatedPost = Object.assign(res.body[0], {
//         title: "A another test title",
//         content: "some content",
//         author: "Blah",
//         publishDate: ""
//       });
//       return chai
//         .request(app)
//         .put(`/blog-post/${res.body[0].id}`)
//         .send(updatedPost)
//         .then(function(res) {
//           expect(res).to.have.status(204);
//         });
//     });
// });
// https://stackoverflow.com/questions/43999918/node-mocha-tests-on-jwt-protected-routes-with-multiple-users

// let rootJwtToken = '';
// let rootUser = new User({});

// let adminJwtToken = '';
// let adminUser = new User({});

// let employeeJwtToken = '';
// let employeeUser = new User({});

// before(() => {
//   rootUser = new User({
//     username: config.mongo.user,
//     password: config.mongo.pwd,
//     email: 'johndoe@example.com',
//     mobileNumber: 123456789
//   });
//   rootUser.save(() => {});
//   adminUser = new User({
//     username: 'adminUser',
//     password: '123456789',
//     email: 'admin.user@example.com',
//     mobileNumber: 999999999
//   });
//   adminUser.save(() => {});
//   employeeUser = new User({
//     username: 'employeeUser',
//     password: '123456789',
//     email: 'employee.user@example.com',
//     mobileNumber: 888888888
//   });
//   employeeUser.save(() => {});
// });

// after(() => {
//   User.remove(() => {});
//   Group.remove(() => {});
//   // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
//   mongoose.models = {};
//   mongoose.modelSchemas = {};
//   mongoose.connection.close();
// });

// describe('## root user w Group APIs', () => {
//   it('should get valid JWT token', () =>
//     request(app)
//       .post('/api/v1/auth/login')
//       .send({ username: rootUser.username, password: rootUser.password })
//       .expect(httpStatus.OK)
//       .then((res) => {
//         expect(res.body).to.have.property('token');
//         rootJwtToken = `Bearer ${res.body.token}`;
//       })
//   );

//   let group = {
//     name: 'Admin',
//     description: 'Administration group'
//   };

//   describe('# POST /api/v1/groups', () => {
//     ...
//  });
// });

// describe('## admin user w Group APIs', () => {
//   it('should get valid JWT token', () =>
//     request(app)
//       .post('/api/v1/auth/login')
//       .send({ username: adminUser.username, password: adminUser.password })
//       .expect(httpStatus.OK)
//       .then((res) => {
//         expect(res.body).to.have.property('token');
//         adminJwtToken = `Bearer ${res.body.token}`;
//       })
//   );

//   let group = {
//     name: 'Marketing',
//     description: 'Marketing group'
//   };

//   describe('# POST /api/v1/groups', () => {
//   });
//  });

// describe('## employee user w Group APIs', () => {
//   it('should get valid JWT token', () =>
//     request(app)
//       .post('/api/v1/auth/login')
//       .send({ username: employeeUser.username, password: employeeUser.password })
//       .expect(httpStatus.OK)
//       .then((res) => {
//         expect(res.body).to.have.property('token');
//         employeeJwtToken = `Bearer ${res.body.token}`;
//       })
//   );

//   let group = {
//     name: 'Union',
//     description: 'Union group'
//   };

//  describe('# POST /api/v1/groups', () => {
//    ...
//   });
// })
