// employees.js
var faker = require('./node_modules/Faker');

function generateEmployees () {
  var employees = []
  for (var id = 1; id <= 20; id++) {
    var firstName = faker.name.firstName()
    var lastName = faker.name.lastName()
    var findName = faker.name.findName()
    var email = faker.internet.email()
    var phone = faker.phone.phoneNumber('+33 ### ## ##')
    var jobTitle = faker.name.jobTitle()
    var address = faker.address.streetAddress()
    var rating = faker.datatype.number({ max: 5 }, {min: 1})
    var price = faker.datatype.number({ max: 100 }, {min: 20})
    var date = faker.date.recent()
    var transaction = faker.finance.bitcoinAddress()
    var skill = faker.name.jobType()
    var language = faker.lorem.word(5)
    employees.push({
      "id": id,
      "first_name": firstName,
      "last_name": lastName,
      "findName": findName,
      "email": email,
      "phone": phone,
      "jobTitle": jobTitle,
      "address": address,
      "rating": rating,
      "date": date,
      "price": price,
      "transaction": transaction,
      "skill": skill,
      "language": language,

    })
  }
  return { "employees": employees }
}
module.exports = generateEmployees