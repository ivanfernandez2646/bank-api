## Description

Mini Bank API (very tiny) 😎.

<table>
  <tr>
    <td valign="center">
      <h4>Stack</h4>
      <ul list-style-type="none">
        <li>
          <img align="center" src="https://docs.nestjs.com/assets/logo-small.svg" alt="drawing" width="30"/> NestJS (Typescript)
        </li>
        <br/>
        <li>
          <img align="center" src="https://www.zoneofit.com/wp-content/uploads/2021/06/type-orm.png" alt="drawing" width="30"/> TypeORM
        </li>
        <br/>
        <li>
          <img align="center" src="http://www.geomapik.com/wp-content/uploads/2019/09/postgresql-logo-921x1024.png" alt="drawing" width="30"/> PostgreSQL
        </li>
        <br/>
        <li>
          <img align="center" src="https://cdn-icons-png.flaticon.com/512/919/919853.png" alt="drawing" width="30"/> Docker
        </li>
        <br/>
        <li>
          <img align="center" src="https://nx.dev/documentation/shared/jest-logo.png" alt="drawing" width="30"/> Jest
        </li>
        <br/>
      </ul>
    </td>
    <td valign="center">
      <a href="https://www.youtube.com/watch?v=mMnvO_KoSsY" target="_blank">
        <img src="https://i.pinimg.com/originals/81/70/c0/8170c0b0cddec975b7c2553c20c1ab7e.png" alt="drawing" width="200"/>
      </a>
    </td>
  </tr>
</table>

## Installation

```bash
$ npm install
```

## Running the app

```bash
# dev
$ npm run start:dev

# debug
$ npm run start:debug
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests (also includes a little integration test)
$ npm run test:e2e
```

## TODO Improves

<ol>
  <li>Date audit fields  automatically insert on create or update an entity (createdAt, updatedAt).</li>
  <li>Mock repositories to increase coverage on unit testing.</li>
  <li>Insert currentBalance field directly on BBDD.</li>
</ol>
