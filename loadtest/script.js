import http from 'k6/http';
import { sleep, check } from 'k6';

const login = 'admin'
const password = 'password'
const baseUrl = 'http://lighthouse.local:8000/';

const payload = JSON.stringify({
  username: login,
  password: password,
});
const params = {
  headers: {
    'Content-Type': 'application/json',
  },
};
const loginUrl = `${baseUrl}api/auth/`
const clientUrl = `${baseUrl}contract/?state=-1`
const userUrl = `${baseUrl}user/?active=on`
const employeeUrl = `${baseUrl}employee/`
const orgUrl = `${baseUrl}org/`
let token = ''


export default function() {

  if (!token) {
    const response = http.post(loginUrl, payload, params);
    token = response.json(['access'])
  }
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  let res = http.get(clientUrl, options)
  check(res, {
    'client status 200': (r) => r.status === 200,
    'client json data not empty': (r) => r.json().length !== 0
  })

  res = http.get(userUrl, options)
  check(res, {
    'users status 200': (r) => r.status === 200,
    'users json data not empty': (r) => r.json().length !== 0
  })

  res = http.get(employeeUrl, options)
  check(res, {
    'employee status 200': (r) => r.status === 200,
    'employee json data not empty': (r) => r.json().length !== 0
  })

  res = http.get(orgUrl, options)
  check(res, {
    'org status 200': (r) => r.status === 200,
  })


}
