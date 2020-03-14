<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/schema-forms/assets/js/bower-webfontloader/webfont.js" ></script>
<script src="/schema-forms/assets/js/snap.svg/snap.svg-min.js" ></script>
<script src="/schema-forms/assets/js/underscore/underscore-min.js" ></script>
<script src="/schema-forms/assets/js/js-sequence-diagrams/sequence-diagram-min.js" ></script>

A backward-compatible extension for [HAL-Forms](http://rwcbook.github.io/hal-forms/) to provide support dynamic runtime input forms with JSON Schema 

# Motivation
[HAL-Forms](http://rwcbook.github.io/hal-forms/), an extension of HAL, introduces another element, `_templates`. `_templates` make it possible to show all the operations possible as well as attributes needed for each operation.

Sometimes more complex UI Validation is required than HAL-Forms exposes via `properties[name, prompt, readOnly, regex, required, templated, value]` to be able to submit a valid form. Giving the consumer of an API more options to validate a request before they submit it, increases the user expirience and saves server round-trips.

The motivation is to combine and extend HAL-Forms with  JSON-Schema and to provide a localized, cacheable JSON Validation Schema to make the API even more user-friendly always (I _LOVE**OAS**_).

JSON schema is a popular standard for the API model specification and has many libraries that make use of it e.g.:
- JSON Schema Code Generators ( for Java, Python, ...)
- JSON Schema Forms ( https://github.com/rjsf-team/react-jsonschema-form ) 
- JSON Schema Validators (Ajv,...)
- JSON Schema Example Generators (FakerJs, ...)

# Extention of HAL Forms
## Compliance
The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC2119].
## Definition

[HAL-Forms](http://rwcbook.github.io/hal-forms/)'s `template` element contains an additional `jsonSchema` attribute.

- `jsonSchema`
  
    - This is a valid JSON Validation Schema.
    - This is an OPTIONAL element.
    - The JSON Validation Schema MAY has a canonical URI of a schema (e.g `"$id": "http://example.com/api/v1/employees.json"`)
    - MAY contain the referenced schema or a dynamic subset, depending on the context of the user (different modification rights), the status of the data record (active, final status) or the operation (GET, POST, PATCH, ...).
    - SHOULD be the localized (`title`, `description`, ...)
    - if `jsonSchema` is present then `properties` becomes redundant (or obsolete !?)
    
    Example:
    ```
    "_templates" : {
        "default" : {
            "title" : "Filter",
            "method":"GET",
            "contentType": "application/x-www-form-urlencoded",
            "jsonSchema": {
                "$id": "http://example.com/api/v1/employees",
                "$schema": "https://json-schema.org/draft/2019-09/schema",
                "type": "object",
                "properties": {
                    ...
                }
            }
        }
    }
    ```
### Validation Options

Comparison between HAL Forms `_templates..properties` and JSON Validation Schema

_template.properties | JSON Schema alternative
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
n/a | `oneOf` type(e.g. string) level options (localized complex `enum`)
n/a | `if`, `then`, `else`, `dependentSchemas` conditional subschema
n/a | [many more...](https://json-schema.org/draft/2019-09/json-schema-validation.html)

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
```
GET /api/v1/employees HTTP/1.1
Accept: application/prs.hal-forms+json; charset=utf-8;
Accept-Language: en; fr;q=0.9, de;q=0.8
```
Response
```
HTTP 200
Content-Type: application/prs.hal-forms+json; charset=utf-8;

{
  "_embedded": {
    "employees": [
      {
        "id": 1,
        "firstName": "John",
        "lastName": "string",
        "birthday": "2000-12-31",
        "email": "john.doe@example.com",
        "status": "PART-TIME",
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
        "$id": "http://example.com/api/v1/employees#employee",
        "$schema": "https://json-schema.org/draft/2019-09/schema",
        "type": "object",
        "properties": {
          "firstName": {
          },
          "lastName": {
          },
          "status": {
          }
        }
      }
    },
    "addEmployee": {
      "title": "Add Employee",
      "method": "POST",
      "contentType": "application/json",
      "jsonSchema": {
        "$id": "http://example.com/api/v1/employees#employee",
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
          "status": {
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
Follow the `jsonSchema`'s identifier `$id` to get the full, localized and cacheable JSON Validation Schema of the API Resource `/employees`.

```
"jsonSchema": {
    "$id": "http://example.com/api/v1/employees#employee"
    ...
}
```

Request
```
GET /api/v1/employees HTTP/1.1
Accept: application/schema+json; charset=utf-8;
Accept-Language: en; fr;q=0.9, de;q=0.8
```
Response
```
HTTP 200
Content-Type: application/schema+json; charset=utf-8;
Content-Language: en
Cache-Control: max-age=3600
Etag: x123dfff
Vary: Accept-Language

{
  "$id": "http://example.com/api/v1/employees",
  "$schema": "https://json-schema.org/draft/2019-09/schema",
  "$defs": {
    "employee": {
        "$anchor": "employee",
        "type": "object",
        "properties": {
            "id": {
                "type": "integer",
                "title": "#"
            },
            "firstName": {
                "type": "string",
                "example": "John",
                "minLength": 1
            },
            "lastName": {
                "type": "string",
                "example": "Doe",
                "minLength": 1
            },
            "birthday": {
                "type": "string",
                "format": "date"
            },
            "email": {
                "type": "string",
                "format": "email"
            },
            "status": {
                "type": "string",
                "oneOf": [
                    {
                        "const": "PART-TIME",
                        "title": "Part-time"
                    },{
                        "const": "PERMANENT",
                        "title": "Permanent"
                    },{
                        "const": "RESIGNED",
                        "title": "Resigned"
                    }
                ]
            }
        }
    },
    "employeeLinks": {
        "$anchor": "employeeLinks",
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
}
```

### 4. Get more employees (next page)

A HAL form is usually required for the first request. The HAL form can be omitted in subsequent request.

Request
```
GET /api/v1/employees HTTP/1.1
Accept: application/hal+json; charset=utf-8;
Accept-Language: en; fr;q=0.9, de;q=0.8
```
Response
```
HTTP 200
Content-Type: application/hal+json; charset=utf-8;

{
  "_embedded": {
    "employees": [
      {
        "id": 21,
        "firstName": "Mary",
        "lastName": "Moe",
        "birthday": "1999-02-28",
        "email": "mary.moe@example.com",
        "status": "PERMANENT",
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

Example API [/api/v1/employees.yaml](https://petstore.swagger.io/?url=https://viigit.github.io/schema-forms/api/v1/employees.yaml)

## Specific API Resource

### 1. Get Data with HAL-Forms of a specific API Resource (JSON Schema enhanced)
   
Request
```
GET /api/v1/employees/1 HTTP/1.1
Accept: application/prs.hal-forms+json; charset=utf-8;
Accept-Language: en; fr;q=0.9, de;q=0.8
```
Response
```
HTTP 200
Content-Type: application/prs.hal-forms+json; charset=utf-8;

{
    "id": 1,
    "firstName": "John",
    "lastName": "doe",
    "birthday": "2000-12-31",
    "email": "john.doe@example.com",
    "status": "PART-TIME",
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
        "addEmployee": {
        "title": "Edit Employee",
        "method": "PATCH",
        "contentType": "application/json",
        "jsonSchema": {
            "$id": "http://example.com/api/v1/employees#employee",
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
                "status": {
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

### 2. Get employee's JSON Validation Schema
Follow the `jsonSchema`'s identifier `$id` to get the full, localized and cacheable JSON Validation Schema of the API Resource `/employees`

```
"jsonSchema": {
    "$id": "http://example.com/api/v1/employees#employee"
    ...
}
```

Request
```
GET /api/v1/employees HTTP/1.1
Accept: application/schema+json; charset=utf-8;
Accept-Language: en; fr;q=0.9, de;q=0.8
If-None-Match: x123dfff
```
Response
```
HTTP 304
Content-Type: application/schema+json; charset=utf-8;
Content-Language: en
Cache-Control: max-age=3100;
Etag: x123dfff
Vary: Accept-Language
```

### 3. Get more employees (next page) 
   
Request
```
GET /api/v1/employees/1 HTTP/1.1
Accept: application/hal+json; charset=utf-8;
Accept-Language: en; fr;q=0.9, de;q=0.8
```
Response
```
HTTP 200
Content-Type: application/hal+json; charset=utf-8;

{
  "_embedded": {
    "employees": [
      {
        "id": 21,
        "firstName": "Mary",
        "lastName": "Moe",
        "birthday": "1999-02-28",
        "email": "mary.moe@example.com",
        "status": "PERMANENT",
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

Example API [/api/v1/employees.yaml](https://petstore.swagger.io/?url=https://viigit.github.io/schema-forms/api/v1/employees.yaml)

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

#### Employees
___
<div class="btn btn-green">add employee</div>
<span class="tooltip"> 1 
<span class="tooltiptext tooltip-top">
Response of GET /api/v1/employees<br>
Accept: application/schema+json
</span>
</span>
___

<table>
  <thead>
    <tr>
      <th>ID</th>
      <th style="text-align: left">Firstname
        <span class="tooltip"> 1
        <span class="tooltiptext tooltip-top">
        Response of GET /api/v1/employees</br>
        Accept: application/schema+json
        </span>
        </span>
      </th>
      <th style="text-align: left">Lastname<
        <span class="tooltip"> 1
        <span class="tooltiptext tooltip-top">
        Response of GET /api/v1/employees</br>
        Accept: application/schema+json
        </span>
        </span>
      </th>
      <th style="text-align: left">Date of birth
        <span class="tooltip"> 1
        <span class="tooltiptext tooltip-top">
        Response of GET /api/v1/employees</br>
        Accept: application/schema+json
        </span>
        </span>
      </th>
      <th style="text-align: left">Status
        <span class="tooltip"> 1
        <span class="tooltiptext tooltip-top">
        Response of GET /api/v1/employees</br>
        Accept: application/schema+json
        </span>
        </span>
      </th>
      <th style="text-align: center">Actions
        <span class="tooltip"> 1 
        <span class="tooltiptext tooltip-top">
        Response of GET /api/v1/employees</br>
        Accept: application/schema+json
        </span>
        </span>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td style="text-align: left">John</td>
      <td style="text-align: left">Doe</td>
      <td style="text-align: left">1967-12-22</td>
      <td style="text-align: left">Festangestellt</td>
      <td style="text-align: center">
      <div class="btn btn-red">remove</div><span class="tooltip"> 2
        <span class="tooltiptext tooltip-top">
        Response of GET /api/v1/employees</br>
        Accept: application/schema+json
        </span>
        </span>
      <div class="btn btn-blue">edit</div><span class="tooltip"> 2
        <span class="tooltiptext tooltip-top">
        Response of GET /api/v1/employees</br>
        Accept: application/schema+json
        </span>
        </span></td>
    </tr>
    <tr>
      <td>2</td>
      <td style="text-align: left">Mary</td>
      <td style="text-align: left">Major</td>
      <td style="text-align: left">2000-02-28</td>
      <td style="text-align: left">Gekündigt</td>
      <td style="text-align: center"><div class="btn btn-blue">edit</div></td>
    </tr>
  </tbody>
</table>

# References
- HAL-Form [http://rwcbook.github.io/hal-forms](http://rwcbook.github.io/hal-forms/)
- The home of JSON Schema [https://json-schema.org](https://json-schema.org)
  - Canonical URI of a schema (`$id`) [JSON Schema 2019-09](https://json-schema.org/draft/2019-09/json-schema-core.html)
- Inspired by [APIs you won't hate](https://apisyouwonthate.com/blog/lets-stop-building-apis-around-a-network-hack)
- ETag, Cache-Control 
  - [https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching)
  - [https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
-  Key words for use in RFCs to Indicate Requirement Levels [RFC2119](http://tools.ietf.org/html/rfc2119)
-  Spring Affordance HATEOAS [https://spring.io/blog/2018/01/12/building-richer-hypermedia-with-spring-hateoas](https://spring.io/blog/2018/01/12/building-richer-hypermedia-with-spring-hateoas)

- This Page [https://viigit.github.io/schema-forms/](https://viigit.github.io/schema-forms/)


<script> 
    var options = {theme: 'simple'};
    $(".diagram").sequenceDiagram(options);
</script>
