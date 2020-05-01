<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/schema-forms/assets/js/bower-webfontloader/webfont.js" ></script>
<script src="/schema-forms/assets/js/snap.svg/snap.svg-min.js" ></script>
<script src="/schema-forms/assets/js/underscore/underscore-min.js" ></script>
<script src="/schema-forms/assets/js/js-sequence-diagrams/sequence-diagram-min.js" ></script>
<script src="/schema-forms/assets/js/sticky-header.js" ></script>
<nav>
  <ul>
    <li><a href="#motivation">Motivation</a></li>
    <li><a href="#extention-of-hal-forms">Form Extention</a></li>
    <li><a href="#hal-form-i18n-extention">i18n Extention</a></li>
    <li><a href="#workflow-examples">Examples</a></li>
    <li><a href="#references">References</a></li>
  </ul>
</nav>

A backward-compatible extension for [HAL-Forms](http://rwcbook.github.io/hal-forms/) to provide JSON Validation Schema for forms. 

# Motivation

[HAL-Forms](http://rwcbook.github.io/hal-forms/), an extension of HAL, introduces another element, `_templates`. `_templates` make it possible to show all the operations possible as well as attributes needed for each operation.

HAL-Forms comes with a reduced set of validation rules `properties[name, prompt, readOnly, regex, required, templated, value]` compared to JSON Validation Schema.

The motivation is to combine and extend HAL-Forms with  JSON-Schema and to provide a localized, cacheable JSON Validation Schema to make the API even more user-friendly always (I _LOVE**OAS**_).

## JSON schema

JSON schema is a popular standard for API model specifications and has many libraries that make use of it e.g.:

- JSON Schema Code Generators ( for Java, Python, ...)
- JSON Schema Forms ( https://github.com/rjsf-team/react-jsonschema-form )
- JSON Schema Validators (Ajv,...)
- JSON Schema Example Generators (FakerJs, ...)

### Comparison between HAL Forms and JSON Validation Schema

HAL Form <br>`_templates..properties` | JSON Schema <br>alternative
:--- | :---
`name` | attribute's name
`prompt` | MAY `example`
`templated` | n/a
`value` | `default`
**Validation Keywords for Strings:** |
`regex` | `pattern`
`regex` | `minLength`, `maxLength`, ...
**Validation Keywords for Objects:** |
`required` | `required`
n/a | `dependentRequired`
**Validation Keywords for Arrays:** |
n/a | `maxItems`, `minItems`, `uniqueItems`, ...
**Basic Meta-Data Annotations:** |
`readOnly` | `readOnly`
n/a | `writeOnly`, ...
*n/a | `title`, `description` UI agnostic, but COULD be used as Label, Tooltip, ...
**Keywords for Applying Subschemas:** |
n/a | `oneOf`, `anyOf` at Object level
`regex` | `oneOf` type(e.g. string) level options (localized complex `enum`)
n/a | `if`, `then`, `else`, `dependentSchemas` conditional subschema
n/a | [many more...](https://json-schema.org/draft/2019-09/json-schema-validation.html)

# HAL Form - JSONSchema Extention

### Compliance

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC2119](http://tools.ietf.org/html/rfc2119).

## Definition

[HAL-Forms](http://rwcbook.github.io/hal-forms/)'s `_template` element contains an additional `jsonSchema` attribute:
  
- `jsonSchema` MUST contains a valid JSON Validation Schema.
- `jsonSchema` is an OPTIONAL element.
- `jsonSchema` MAY has a canonical URI of a schema (e.g `"$id": "http://example.com/api/v1/employees.json"`)
- `jsonSchema` MAY contains the referenced schema or a dynamic subset, depending on the context of the user (different modification rights), the status of the data record (active, final status) and the operation (GET, POST, PATCH, ...).
- `jsonSchema` SHOULD be the localized (`title`, `description`, ...)
- if `jsonSchema` is present then `properties` becomes redundant (or obsolete !?)

Example: GET Form with required query parameter

``` javascript
{
  "firstName": "John",
  ...

  "_templates" : {
    "default" : {
      "title" : "Filter",
      "method":"GET",
      "contentType": "application/x-www-form-urlencoded",
      "jsonSchema": {
        "$id": "http://example.com/api/v1/employees",
        "$schema": "https://json-schema.org/draft/2019-09/schema",
        "type": "object",
        "required": ["firstName"],
        "properties": {
          "firstName": {
            "type": "string"
          }
        }
      }
    }
  }
}
```

# HAL Form - i18n Extention
### Compliance
The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC2119](http://tools.ietf.org/html/rfc2119)..
## Definition

# Workflow Examples

## API Resource Collections

This example shows possible workflows to get the collection of records with their form templates and dynamic JSON schemas:

<div class="diagram">
Note over Consumer: 1. Read Employees\nwith HAL Forms
Consumer->Provider: GET /api/v1/employees\n[application/prs.hal-forms+json]
Note right of Provider: 1st page of Employees\nwith HAL Links\nwith HAL Forms
Provider-->Consumer: 200: Ok (JSON Data)

Note over Consumer: 2. GET `jsonSchema`
Consumer->Provider: GET /api/v1/employees\n[application/schema+json]
Note right of Provider: Localized static JSON Schema\nof the Employee Resource\nwith `ETag` Header\nwith `Cache-Control` Header
Provider-->Consumer: 200: Ok (JSON Schema)

Note over Consumer: 3. Add new Employee\nwith HAL Forms
Consumer->Provider: POST /api/v1/employees\n[application/prs.hal-forms+json]
Note right of Provider: a)Created Employees\nwith HAL Link\nwith HAL Forms
Provider-->Consumer: 201: Created (JSON Data)
Note right of Provider: b) or\nwith validation failures\n\nwith updated HAL Forms
Provider-->Consumer: 400: Bad request (JSON Data)

Note over Consumer: 4. Read next Employees\nwithout HAL Form
Consumer->Provider: GET /api/v1/employees?page=2\n[application/hal+json]
Note right of Provider: 2nd page of Employees\nwith HAL Links
Provider-->Consumer: 200: JSON Data
</div>

### 1. Get Data with HAL-Forms (JSON Schema enhanced)

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
        "birthday": "2000-12-31",
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
      "jsonSchema": {
        "$id": "http://example.com/api/v1/employees",
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
      "jsonSchema": {
        "$id": "http://example.com/api/v1/employees",
        "$schema": "https://json-schema.org/draft/2019-09/schema",
        "type": "object",
        "required": [
          "firstName",
          "lastName",
          "birthday"
        ],
        "properties": {
          "firstName": {
          },
          "lastName": {
          },
          "birthday": {
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

### 2. Get employee's JSON Validation Schema

Follow the `jsonSchema`'s identifier `"$id": "http://example.com/api/v1/employees"` to get the full, localized and cacheable JSON Validation Schema of the API Resource `/employees`.

There is no standard yet but a [controversial feature request @ json-schema-org](https://github.com/json-schema-org/json-schema-vocabularies) [annotation: Multilingual meta data](https://github.com/json-schema-org/json-schema-spec/issues/53)

Request

``` javascript
GET /api/v1/employees HTTP/1.1
Accept: application/schema+json;
Accept-Language: en; fr;q=0.9, de;q=0.8
```

Response

``` javascript
HTTP 200
Content-Type: application/schema+json;
Content-Language: en
Cache-Control: max-age=3600
Etag: x123dfff
Vary: Accept-Language

{
    "$id": "http://example.com/api/v1/employees",
    "$schema": "https://json-schema.org/draft/2019-09/schema",
    "$defs": {
        "employeeSalary": {
            "$anchor": "salary",
            "$id": "http://example.com/api/v1/salaries"
        },
        "resign": {
            "$anchor": "ResignReason",
            "type": "object",
            "title": "Resign",
            "properties": {
                "reason": {
                    "type": "string",
                    "title": "Reason for termination",
                    "minLength": 10,
                    "maxLength": 100
                }
            }
        },
        "employeeLinks": {
            "$anchor": "EmployeeLinks",
            "type": "object",
            "properties": {
                "_links": {
                    "type": "object",
                    "properties": {
                        "self": {
                            "type": "object",
                            "title": "Refresh"
                        }
                    }
                }
            }
        }
    },
    "$anchor": "employee",
    "type": "object",
    "properties": {
        "id": {
            "type": "integer",
            "title": "#"
        },
        "firstName": {
            "type": "string",
            "title": "First Name",
            "description": "First name with initials of the second first name",
            "example": "John F.",
            "minLength": 1
        },
        "lastName": {
            "type": "string",
            "title": "Last Name",
            "example": "Doe",
            "minLength": 1
        },
        "birthday": {
            "type": "string",
            "title": "Date of Birth",
            "default" : "1990-01-01",
            "format": "date"
        },
        "email": {
            "type": "string",
            "title": "Email",
            "format": "email"
        },
        "workload": {
            "type": "string",
            "title": "Workload",
            "oneOf": [
                {
                    "const": "PART-TIME",
                    "title": "Part-time"
                },{
                    "const": "PERMANENT",
                    "title": "Permanent"
                }
            ]
        },
        "active": {
            "type": "boolean",
            "title": "Status",
            "oneOf": [
                {
                    "const": true,
                    "title": "Active"
                },{
                    "const": false,
                    "title": "Resigned"
                }
            ]
        }
    }
}
```

Request Internationalization of schema attributes

``` javascript
GET /api/v1/employees HTTP/1.1
Accept: application/schema-i18n+json;
Accept-Language: en; fr;q=0.9, de;q=0.8
```

Response Option A 

``` javascript
HTTP 200
Content-Type: application/schema-i18n+json;
Content-Language: en
Cache-Control: max-age=3600
Etag: x123dfff
Vary: Accept-Language

{
    "$id": "http://example.com/api/v1/employees",
    "$schema": "https://json-schema.org/draft/2019-09/schema",
    "$defs": {
        "resign": {
            "title": "Resign",
            "properties": {
                "reason": {
                    "title": "Reason for termination"
                }
            }
        },
        "employeeLinks": {
            "properties": {
                "_links": {
                    "properties": {
                            "title": "Refresh"
                        }
                    }
                }
            }
        }
    },
    "$anchor": "employee",
    "type": "object",
    "properties": {
        "id": {
            "title": "#"
        },
        "firstName": {
            "title": "First Name",
            "description": "First name with initials of the second first name",
            "example": "Employee's first name"
        },
        "lastName": {
            "title": "Last Name",
            "example": "Doe"
        },
        "birthday": {
            "title": "Date of Birth"
        },
        "email": {
            "title": "Email",
            "default" : "@example.com"
        },
        "workload": {
            "title": "Workload",
            "oneOf": [
                {
                    "const": "PART-TIME",
                    "title": "Part-time"
                },{
                    "const": "PERMANENT",
                    "title": "Permanent"
                }
            ]
        },
        "active": {
            "title": "Status",
            "oneOf": [
                {
                    "const": true,
                    "title": "Active"
                },{
                    "const": false,
                    "title": "Resigned"
                }
            ]
        }
    }
}
```

Response Option B

[spring-hateoas#mediatypes.hal-forms.i18n](https://docs.spring.io/spring-hateoas/docs/current/reference/html/#mediatypes.hal-forms.i18n)

```
HTTP 200
Content-Type: application/schema-i18n+json;
Content-Language: en
Cache-Control: max-age=3600
Etag: x123dfff
Vary: Accept-Language

{
    "$id": "http://example.com/api/v1/employees",

    "Employee.titel": "Employee",

    "Employee.id.titel": "#",

    "Employee.firstName.titel": "First Name",
    "Employee.firstName.description": "First name with initials of the second first name",
    "Employee.firstName.example": "Employee's first name",

    "Employee.lastName.titel": "Last Name",
    "Employee.lastName.example": "Employee's first name",

    "Employee.birthday.titel": "Date of Birth",

    "Employee.email.titel": "Email",
    "Employee.email.description": "Business email address",
    "Employee.email.default": "@example.com",

    "Employee.workload.titel": "Workload",
    "Employee.workload.oneOf.PART-TIME.title": "Part-time",
    "Employee.workload.oneOf.PERMANENT.title": "Permanent",

    "Employee.active.titel": "Status",
    "Employee.active.oneOf.true.title": "Active",
    "Employee.active.oneOf.false.title": "Resigned",


    "ResignReason.title": "Resign",
    "ResignReason.reason.title": "Reason for termination",

    "EmployeeLinks._links.self.title": "Refresh"
}
```

### 3. Submit new Employee Record

Request

``` javascript
POST /api/v1/employees HTTP/1.1
Accept: application/prs.hal-forms+json;
Accept-Language: en; fr;q=0.9, de;q=0.8

{
  "firstName": "John",
  "lastName": "Doe",
  "birthday": "2200-12-31",
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
      "$id": "#/birthday",
      "reason": "must be in the past"
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
      "jsonSchema": {
        "$id": "http://example.com/api/employees",
        "$schema": "https://json-schema.org/draft/2019-09/schema",
        "type": "object",
        "required": [
          "firstName",
          "lastName",
          "birthday"
        ],
        "properties": {
          "firstName": {
          },
          "lastName": {
          },
          "birthday": {
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

### 4. Get more employees (next page)

A HAL form is usually required for the first request. The HAL form can be omitted in subsequent request.

Request

``` javascript
GET /api/v1/employees HTTP/1.1
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
        "birthday": "1999-02-28",
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

Note over Consumer: 6. GET `jsonSchema`
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
  "birthday": "2000-12-31",
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
      "jsonSchema": {
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

Follow the `jsonSchema`'s identifier `"$id": "http://example.com/api/v1/employees"` to get the full, localized and cacheable JSON Validation Schema of the API Resource `/employees`.

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
        "birthday": "1999-02-28",
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

Note over Consumer: 2. Follow uri ($id) of\n`jsonSchema` within HAL Forms
Consumer->Provider: GET /api/v1/employees\n[application/schema+json]
Note right of Provider: Localized static JSON Schema\nof the Employee Resource\nwith `ETag` and `Cache-Control` HTTP Header
Provider-->Consumer: 304: Not Modified

Note over Consumer: 3a. Update Employee (With HAL Form)
Consumer->Provider: GET /api/v1/employees?page=2\n[application/prs.hal-forms+json]
Note right of Provider: Collection of Employees\nwith HAL Links
Provider-->Consumer: 200: JSON Data

Note over Consumer: 3b. Update Employee (Without HAL Form)
Consumer->Provider: GET /api/v1/employees?page=2\n[application/json]
Note right of Provider: Collection of Employees\nwith HAL Links
Provider-->Consumer: 200: JSON Data
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
