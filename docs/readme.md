<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/schema-forms/assets/js/bower-webfontloader/webfont.js" ></script>
<script src="/schema-forms/assets/js/snap.svg/snap.svg-min.js" ></script>
<script src="/schema-forms/assets/js/underscore/underscore-min.js" ></script>
<script src="/schema-forms/assets/js/js-sequence-diagrams/sequence-diagram-min.js" ></script>
<script src="/schema-forms/assets/js/sticky-header.js" ></script>
<nav>
  <ul>
    <li><a href="#motivation">Motivation</a></li>
    <li><a href="#hal-form---jsonschema-extention">Form Extention</a></li>
    <li><a href="#hal-form---i18n-extention">i18n Extention</a></li>
    <li><a href="#workflow-examples">Examples</a></li>
    <li><a href="#references">References</a></li>
  </ul>
</nav>

A backward-compatible extension for [HAL-Forms](http://rwcbook.github.io/hal-forms/) to provide a JSON Validation Schema for forms.

# Motivation

[HAL-Forms](http://rwcbook.github.io/hal-forms/), an extension of HAL, introduces another element, `_templates`. With `_templates` it is possible to show all possible operations as well as the attributes required for each operation.

HAL-Forms has a reduced set of validation rules `properties[name, prompt, readOnly, regex, required, templated, value]` compared to JSON Validation Schema.

The motivation is to combine and extend HAL-Forms with  JSON-Schema and to provide a localized, cacheable JSON Validation Schema to make the API even more user-friendly (I _LOVE**OAS**_).

## JSON schema

JSON schema is a popular standard for API model specifications and has many libraries that make use of it e.g.:

- JSON Schema: With [OpenAPI](https://swagger.io/specification/) [3.1.0-rc](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#schemaObject) the schema object is a superset of the [JSON Schema Specification Draft 2019-09](http://json-schema.org)
- JSON Schema: Code Generators ( for Java, Python, ...)
- JSON Schema: Forms ( https://github.com/rjsf-team/react-jsonschema-form )
- JSON Schema: Validators (Ajv,...)
- JSON Schema: Example Generators (FakerJs, ...)

### Comparison between HAL Forms's `properties` and `schema` as JSON Validation Schema

HAL Form <br>`_templates..properties` | JSON Validation Schema <br>`_templates..schema`
:--- | :---
`name` | attribute's name
`prompt` | MAY `example`
`templated` | n/a
`value` | `default`
**Validation Keywords for Strings:** |
`regex` | `pattern`
`regex` | `minLength`, `maxLength`, ...
n/a | `format` for `date`, `date-time`, ...
**Validation Keywords for Objects:** |
`required` | `required`
n/a | `dependentRequired`
**Validation Keywords for Arrays:** |
n/a | `maxItems`, `minItems`, `uniqueItems`, ...
**Basic Meta-Data Annotations:** |
`readOnly` | `readOnly`
n/a | `writeOnly`, ...
*n/a | `title`, `description` UI agnostic, but COULD be used as Label, Tooltip, ...
**Keywords for applying alternative schemas:** |
n/a | `oneOf`, `anyOf` at object level
`regex` | `oneOf` type(e.g. string) level options (localized complex `enum`)
**Keywords for applying conditional schemas:** |
n/a | `if`, `then`, `else`, `dependentSchemas`
n/a | [many more...](https://json-schema.org/draft/2019-09/json-schema-validation.html)

# HAL Form - JSONSchema Extention

### Compliance

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC2119](http://tools.ietf.org/html/rfc2119).

## Definition

[HAL-Forms](http://rwcbook.github.io/hal-forms/)'s `_template` element contains an additional `schema` property:
  
- `schema` MUST contains a valid JSON Validation Schema
- `schema` MUST match with the schema of the `method` to construct a successful subsequent request
- `schema` is an OPTIONAL property
- `schema` MAY has a canonical URI of the whole schema (e.g `"$id": "http://example.com/api/v1/employees.json"`)
- `schema` MAY contains the referenced schema or a dynamic subset, depending on the context of the user (different access or modification rights), the status of data record (e.g. active, archived, ...) and the operation (GET, POST, PATCH, ...)
- `schema` MAY provides `title` and `description` which SHOULD be localized
- only one of `schema` or `properties` property is present. Providing both would be redundant.

_Example:_ GET Form with required query parameter

``` javascript
{
  ...

  "_templates" : {
    "default" : {
      "title" : "Filter",
      "method":"GET",
      "contentType": "application/x-www-form-urlencoded",
      "schema": {
        "$id": "http://example.com/api/v1/employees.json#employee",
        "$schema": "https://json-schema.org/draft/2019-09/schema",
        "type": "object",
        "required": ["firstName"],
        "properties": {
          "firstName": {
            "type": "string",
            "minLength": 2
          }
        }
      }
    }
  }
}
```

Example [/api/v1/employees.yaml](https://editor.swagger.io/?url=https://viigit.github.io/schema-forms/api/v1/employees.yaml)

# Workflow Examples

## HAL Forms for Collections

This example shows possible workflows to get the collection of records with HAL form templates and dynamic JSON schemas:

<div class="diagram">
Note over Consumer: 1. Read Employees\nwith HAL Forms
Consumer->Provider: GET /api/v1/employees\n[application/prs.hal-forms+json]
Note right of Provider: 1st page of Employees\nwith HAL Links\nwith HAL Forms
Provider-->Consumer: 200: Ok (JSON Data)

Note over Consumer: 2. Add new Employee\nwith HAL Forms
Consumer->Provider: POST /api/v1/employees\n[application/prs.hal-forms+json]
Note right of Provider: a)Created Employees\nwith HAL Link\nwith HAL Forms
Provider-->Consumer: 201: Created (JSON Data)
Note right of Provider: b) or\nwith validation failures\n\nwith updated HAL Forms
Provider-->Consumer: 400: Bad request (JSON Data)

Note over Consumer: 3. Read next Employees\nwithout HAL Form
Consumer->Provider: GET /api/v1/employees?page=2\n[application/hal+json]
Note right of Provider: 2nd page of Employees\nwith HAL Links
Provider-->Consumer: 200: JSON Data
</div>

### 1. Get a list of employees with HAL-Forms (JSON Schema enhanced)

Request

``` javascript
GET /api/v1/employees HTTP/1.1

Accept: application/prs.hal-forms+json;
Accept-Language: en; fr;q=0.9, de;q=0.8
```

Response

``` javascript
HTTP 200
Content-Type: application/prs.hal-forms+json;

{
  "_embedded": {
    "employees": [
      {
        "id": 1,
        "firstName": "John",
        "lastName": "string",
        "dateOfBirth": "2000-12-31",
        "email": "john.doe@example.com",
        "workload": "PART-TIME",
        "active": true,
        "_links": {
          "self": {
            "href": "http://example.com/employees/1"
          },
          "leavesCompany": {
            "href": "http://example.com/api/v1/employees/1"
          }
        }
      },
      {...}
    ]
  },
  "_links": {
    "self": {
      "href": "http://example.com/api/v1/employees?page=1"
    },
    "next": {
      "href": "http://example.com/api/v1/employees?page=2"
    }
  },
  "_templates": {
    "self": {
      "title": "Search Employee",
      "method": "GET",
      "contentType": "application/x-www-form-urlencoded",
      "schema": {
        "$id": "http://example.com/api/v1/employees.json#employee",
        "$schema": "https://json-schema.org/draft/2019-09/schema",
        "type": "object",
        "properties": {
          "firstName": {
          },
          "lastName": {
          },
          "workload": {
          }
        }
      }
    },
    "addEmployee": {
      "title": "Add Employee",
      "method": "POST",
      "contentType": "application/json",
      "schema": {
        "$id": "http://example.com/api/v1/employees.json#employee",
        "$schema": "https://json-schema.org/draft/2019-09/schema",
        "type": "object",
        "required": [
          "firstName",
          "lastName",
          "dateOfBirth"
        ],
        "properties": {
          "firstName": {
          },
          "lastName": {
          },
          "dateOfBirth": {
          },
          "email": {
          },
          "workload": {
            "oneOf": [
              {
                "const": "PART-TIME"
              },
              {
                "const": "PERMANENT"
              }
            ]
          }
        }
      }
    }
  }
}
```

### 2. Add an employee with HAL-Forms (JSON Schema enhanced) 

Request

``` javascript
POST /api/v1/employees HTTP/1.1
Accept: application/prs.hal-forms+json;
Accept-Language: en; fr;q=0.9, de;q=0.8

{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "2200-12-31",
  "email": "john.doe@example.com",
  "workload": "PART-TIME"
}
```

Responses

- 3a) Created
  
``` javascript
HTTP 201
Content-Type: application/prs.hal-forms+json;

{
  "_links": {
    "self": {
      "href": "http://example.com/api/v1/employees/1"
    }
  }
}
```

- 3b) Bad Request

``` javascript
HTTP 400
Content-Type: application/problem+json;

{
  "type": "https://example.com/validation-error",
  "title": "Your request parameters didn't validate.",
  "invalidProperties": [
    {
      "$id": "#/dateOfBirth",
      "reason": "Employee must be older than 18 years old"
    },
    {
      "$id": "#/email",
      "reason": "exists already"
    }
  ],
  "_templates": {
    "addEmployee": {
      "title": "Add Employee",
      "method": "POST",
      "contentType": "application/json",
      "schema": {
        "$id": "http://example.com/api/v1/employees.yaml#employee",
        "$schema": "https://json-schema.org/draft/2019-09/schema",
        "type": "object",
        "required": [
          "firstName",
          "lastName",
          "dateOfBirth"
        ],
        "properties": {
          "firstName": {
          },
          "lastName": {
          },
          "dateOfBirth": {
          },
          "email": {
            "enum": [
              "john.doe-01@example.com",
              "john.doe-a@example.com"
            ]
          },
          "workload": {
            "oneOf": [
              {
                "const": "PART-TIME"
              },
              {
                "const": "PERMANENT"
              }
            ]
          }
        }
      }
    }
  }
}
```

### 3. Get more employees (next page)

A HAL form is usually required for the first request. The HAL form can be omitted in subsequent request.

Request

``` javascript
GET /api/v1/employees?page=2 HTTP/1.1

Accept: application/hal+json;
Accept-Language: en; fr;q=0.9, de;q=0.8
```

Response

``` javascript
HTTP 200
Content-Type: application/hal+json;

{
  "_embedded": {
    "employees": [
      {
        "id": 21,
        "firstName": "Mary",
        "lastName": "Moe",
        "dateOfBirth": "1999-02-28",
        "email": "mary.moe@example.com",
        "workload": "PERMANENT",
        "_links": {
          "self": {
            "href": "http://example.com/api/v1/employees/21"
          }
        }
      },
      {...}
    ]
  },
  "_links": {
    "prev": {
      "href": "http://example.com/api/v1/employees?page=1"
    },
    "self": {
      "href": "http://example.com/api/v1/employees?page=2"
    },
    "next": {
      "href": "http://example.com/api/v1/employees?page=3"
    }
  }
}
```

## Specific API Resource

<div class="diagram">
Note over Consumer: 5. Read Employee\nwith HAL Forms
Consumer->Provider: GET /api/v1/employees/1\n[application/prs.hal-forms+json]
Note right of Provider: An Employee\nwith HAL Links\nwith HAL Forms
Provider-->Consumer: 200: Ok (JSON Data)

Note over Consumer: 6. GET `schema`
Consumer->Provider: GET /api/v1/employees\n[application/schema+json]
Note right of Provider: Localized static JSON Schema\nof the Employee Resource\nwith `ETag` Header\nwith `Cache-Control` Header
Provider-->Consumer: 304: Not Modified

Note over Consumer: 7. Update Employee\nwith HAL Forms
Consumer->Provider: POST /api/v1/employees/1\n[application/prs.hal-forms+json]
Note right of Provider: a)Employee updated
Provider-->Consumer: 204: No Content (JSON Data)
Note right of Provider: b) or\nwith validation failures\n\nwith updated HAL Forms
Provider-->Consumer: 400: Bad request (JSON Data)

Note over Consumer: 8. Read next Employees\nwithout HAL Form
Consumer->Provider: DELETE /api/v1/employees/1\n[application/hal+json]
Note right of Provider: Employee Removed
Provider-->Consumer: 204: No Content
</div>

### 5. Get Data with HAL-Forms of a specific API Resource (JSON Schema enhanced)

Request

``` javascript
GET /api/v1/employees/1 HTTP/1.1
Accept: application/prs.hal-forms+json;
Accept-Language: en; fr;q=0.9, de;q=0.8
```

Response

``` javascript
HTTP 200
Content-Type: application/prs.hal-forms+json;

{
  "id": 1,
  "firstName": "John",
  "lastName": "doe",
  "dateOfBirth": "2000-12-31",
  "email": "john.doe@example.com",
  "workload": "PART-TIME",
  "_links": {
      "self": {
      "href": "http://example.com/employees/1"
      },
      "leavesCompany": {
      "href": "http://example.com/api/v1/employees/1"
      }
  },
  "_links": {
      "self": {
          "href": "http://example.com/api/v1/employees?page=1"
      },
      "next": {
          "href": "http://example.com/api/v1/employees?page=2"
      }
  },
  "_templates": {
      "updateEmployee": {
      "title": "Edit Employee",
      "method": "PATCH",
      "contentType": "application/json",
      "schema": {
        "$id": "http://example.com/api/v1/employees",
        "$schema": "https://json-schema.org/draft/2019-09/schema",
        "type": "object",
        "required": [
        "firstName",
        "lastName",
        ],
        "properties": {
          "firstName": {
          },
          "lastName": {
          },
          "workload": {
              "oneOf": [
              {
                  "const": "PART-TIME"
              },{
                  "const": "PERMANENT"
              }
            ]
          }
        }
      }
    }
  }
}
```

### 6. Get employee's JSON Validation Schema

Follow the `schema`'s identifier `"$id": "http://example.com/api/v1/employees"` to get the full, localized and cacheable JSON Validation Schema of the API Resource `/employees`.

Request
```
GET /api/v1/employees HTTP/1.1
Accept: application/schema+json;
Accept-Language: en; fr;q=0.9, de;q=0.8
If-None-Match: x123dfff
```

Response

``` javascript
HTTP 304
Content-Type: application/schema+json;
Content-Language: en
Cache-Control: max-age=3100;
Etag: x123dfff
Vary: Accept-Language
```

### 7. Get more employees (next page)

Request

``` javascript
GET /api/v1/employees/1 HTTP/1.1
Accept: application/hal+json;
Accept-Language: en; fr;q=0.9, de;q=0.8
```

Response

``` javascript
HTTP 200
Content-Type: application/hal+json;

{
  "_embedded": {
    "employees": [
      {
        "id": 21,
        "firstName": "Mary",
        "lastName": "Moe",
        "dateOfBirth": "1999-02-28",
        "email": "mary.moe@example.com",
        "workload": "PERMANENT",
        "active": true,
        "_links": {
          "self": {
            "href": "http://example.com/api/v1/employees/21"
          }
        }
      },
      {...}
    ]
  },
  "_links": {
    "prev": {
      "href": "http://example.com/api/v1/employees?page=1"
    },
    "self": {
      "href": "http://example.com/api/v1/employees?page=2"
    },
    "next": {
      "href": "http://example.com/api/v1/employees?page=3"
    }
  }
}
```

### Collection Sequence Diagram

<div class="diagram">
Note over Consumer: 1. Read Employees (With HAL Form)
Consumer->Provider: GET /api/v1/employees\n[application/prs.hal-forms+json]
Note right of Provider: Collection of Employees\nwith HAL Links\nwith HAL Forms
Provider-->Consumer: 200: JSON Data

Note over Consumer: 2a. Update Employee (With HAL Form)
Consumer->Provider: GET /api/v1/employees?page=2\n[application/prs.hal-forms+json]
Note right of Provider: Collection of Employees\nwith HAL Links
Provider-->Consumer: 200: JSON Data

Note over Consumer: 2b. Update Employee (Without HAL Form)
Consumer->Provider: GET /api/v1/employees?page=2\n[application/json]
Note right of Provider: Collection of Employees\nwith HAL Links
Provider-->Consumer: 200: JSON Data
</div>

<div class="diagram">
Note over Consumer: 1. Follow uri ($id) of\n`schema` within HAL Form's template to get all JSON Schema details
Consumer->Provider: GET /api/v1/employees\n[application/schema+json]
Note right of Provider: Static JSON Schema\nof the Employee Resource\nwith `Cache-Control` HTTP Header
Provider-->Consumer: 200: JSON Schema
</div>

### Example UI

# Localization

https://docs.spring.io/spring-hateoas/docs/current/reference/html/#mediatypes.hal.i18n
https://docs.spring.io/spring-hateoas/docs/current/reference/html/#mediatypes.hal-forms.i18n

[/api/v1/employees.json](https://viigit.github.io/schema-forms/api/v1/employees.json)
[/api/v1/employees.i18n.en.json](https://viigit.github.io/schema-forms/api/v1/employees.i18n.en.json)
[/api/v1/employees.i18n.de.json](https://viigit.github.io/schema-forms/api/v1/employees.i18n.de.json)
[/api/v1/employees_en_US.properties](https://viigit.github.io/schema-forms/api/v1/employees_en_US.properties.txt)

# References

- Example API [/api/v1/employees.yaml](https://petstore.swagger.io/?url=https://viigit.github.io/schema-forms/api/v1/employees.yaml)
- HAL-Form [http://rwcbook.github.io/hal-forms](http://rwcbook.github.io/hal-forms/)
- The home of JSON Schema [https://json-schema.org](https://json-schema.org)
  - Canonical URI of a schema (`$id`) [JSON Schema 2019-09](https://json-schema.org/draft/2019-09/json-schema-core.html)
- Inspired by [APIs you won't hate](https://apisyouwonthate.com/blog/lets-stop-building-apis-around-a-network-hack)
- ETag, Cache-Control 
  - [https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching)
  - [https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- Key words for use in RFCs to Indicate Requirement Levels [RFC2119](http://tools.ietf.org/html/rfc2119)
- Spring.io
  -  Affordance HATEOAS [https://spring.io/blog/2018/01/12/building-richer-hypermedia-with-spring-hateoas](https://spring.io/blog/2018/01/12/building-richer-hypermedia-with-spring-hateoas)
  -  Internationalization [https://docs.spring.io/spring-hateoas/docs/current/reference/html](https://docs.spring.io/spring-hateoas/docs/current/reference/html/#mediatypes.hal.i18n)

- This Page [https://viigit.github.io/schema-forms/](https://viigit.github.io/schema-forms/)

<script> 
    var options = {theme: 'simple'};
    $(".diagram").sequenceDiagram(options);
</script>
