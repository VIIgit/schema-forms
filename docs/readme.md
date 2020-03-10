<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/schema-forms/assets/js/bower-webfontloader/webfont.js" ></script>
<script src="/schema-forms/assets/js/snap.svg/snap.svg-min.js" ></script>
<script src="/schema-forms/assets/js/underscore/underscore-min.js" ></script>
<script src="/schema-forms/assets/js/js-sequence-diagrams/sequence-diagram-min.js" ></script>

A backward-compatible extension for [HAL-Form](http://rwcbook.github.io/hal-forms/) to provide support dynamic runtime input forms with JSON Schema

# Motivation

# Workflows

## 1. Get Data with HAL-Forms (JSON Schema enhanced)
   
Request
```
GET /employees HTTP/1.1
Accept: application/prs.hal-forms+json; charset=utf-8;
Accept-Language: en; fr;q=0.9, de;q=0.8
```
Response
```
Content-Type: application/prs.hal-forms+json; charset=utf-8;

{
  "_embedded": {
    "employees": [
      {
        "id": 1,
        "firstName": "John",
        "lastName": "string",
        "birthday": "2000-12-31",
        "status": "PART-TIME",
        "_links": {
          "self": {
            "href": "http://example.com/employees/1"
          },
          "leavesCompany": {
            "href": "http://example.com/employees/1"
          }
        }
      },
      {...}
    ]
  },
  "_links": {
    "self": {
      "href": "http://example.com/employees?page=1"
    },
    "next": {
      "href": "http://example.com/employees?page=2"
    }
  },
  "_templates": {
    "default": {
      "title": "Search Employee",
      "method": "GET",
      "contentType": "application/x-www-form-urlencoded",
      "jsonSchema": {
        "$id": "http://example.com/api/employees#employee",
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
        "$id": "http://example.com/api/employees#employee",
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

## 2. Get employee schema
   
Request
```
GET /employees HTTP/1.1
Accept: application/schema+json; charset=utf-8;
Accept-Language: en; fr;q=0.9, de;q=0.8
```
Response
```
Content-Type: application/schema+json; charset=utf-8;
Cache-Control: max-age=3600;
Etag: x123dfff

{
  "$id": "http://example.com/api/employees",
  "$schema": "https://json-schema.org/draft/2019-09/schema",  "$defs": {
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
            "status": {
                "type": "string",
                "oneOf": [
                    {
                        "const": "PART-TIME",
                        "title": "Teilzeit"
                    },{
                        "const": "PERMANENT",
                        "title": "Festangestellt"
                    },{
                        "const": "RESIGNED",
                        "title": "Gekündigt"
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


## 3. Get more employees (next page) 
   
Request
```
GET /employees HTTP/1.1
Accept: application/hal+json; charset=utf-8;
Accept-Language: en; fr;q=0.9, de;q=0.8
```
Response
```
Content-Type: application/hal+json; charset=utf-8;

{
  "_embedded": {
    "employees": [
      {
        "id": 21,
        "firstName": "Mary",
        "lastName": "Moe",
        "birthday": "1999-02-28",
        "status": "PERMANENT",
        "_links": {
          "self": {
            "href": "http://example.com/employees/21"
          }
        }
      },
      {...}
    ]
  },
  "_links": {
    "prev": {
      "href": "http://example.com/employees?page=1"
    },
    "self": {
      "href": "http://example.com/employees?page=2"
    },
    "next": {
      "href": "http://example.com/employees?page=3"
    }
  }
}
```

Example API [/api/employees.yaml](https://petstore.swagger.io/?url=https://viigit.github.io/schema-forms/api/employees.yaml)

## Read Only
<div class="diagram">
Note over Consumer: 1. Read Employees (With HAL Form)
Consumer->Provider: GET /employees\n[application/prs.hal-forms+json]
Note right of Provider: Collection of Employees\nwith HAL Links\nwith HAL Forms
Provider-->Consumer: 200: JSON Data

Note over Consumer: 2. Follow uri ($id) of\n`jsonSchema` within HAL Forms
Consumer->Provider: GET /employees\n[application/schema+json]
Note right of Provider: Localized static JSON Schema\nof the Employee Resource\nwith `ETag` and `Cache-Control` HTTP Header
Provider-->Consumer: 200: JSON Schema

Note over Consumer: 3. Read next Employees (without HAL Form)
Consumer->Provider: GET /employees?page=2\n[application/prs.hal-forms+json]
Note right of Provider: Collection of Employees\nwith HAL Links
Provider-->Consumer: 200: JSON Data
</div>


With the retieved JSON data (collection of employees) and JSON Schema (of Employees)

### Example UI

#### Employees
___
<div class="btn btn-green">add employee</div>
<span class="tooltip"> 1 
<span class="tooltiptext tooltip-top">
Response of GET /employees<br>
Accept: application/schema+json
</span>
</span>

<table>
  <thead>
    <tr>
      <th>ID</th>
      <th style="text-align: left">Firstname
        <span class="tooltip"> 1
        <span class="tooltiptext tooltip-top">
        Response of GET /employees</br>
        Accept: application/schema+json
        </span>
        </span>
      </th>
      <th style="text-align: left">Lastname<
        <span class="tooltip"> 1
        <span class="tooltiptext tooltip-top">
        Response of GET /employees</br>
        Accept: application/schema+json
        </span>
        </span>
      </th>
      <th style="text-align: left">Date of birth
        <span class="tooltip"> 1
        <span class="tooltiptext tooltip-top">
        Response of GET /employees</br>
        Accept: application/schema+json
        </span>
        </span>
      </th>
      <th style="text-align: left">Status
        <span class="tooltip"> 1
        <span class="tooltiptext tooltip-top">
        Response of GET /employees</br>
        Accept: application/schema+json
        </span>
        </span>
      </th>
      <th style="text-align: center">Actions
        <span class="tooltip"> 1 
        <span class="tooltiptext tooltip-top">
        Response of GET /employees</br>
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
        Response of GET /employees</br>
        Accept: application/schema+json
        </span>
        </span>
      <div class="btn btn-blue">edit</div><span class="tooltip"> 2
        <span class="tooltiptext tooltip-top">
        Response of GET /employees</br>
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
HAL-Form [http://rwcbook.github.io/hal-forms](http://rwcbook.github.io/hal-forms/)
The home of JSON Schema [https://json-schema.org](https://json-schema.org)
Inspired by [APIs you won't hate](https://apisyouwonthate.com/blog/lets-stop-building-apis-around-a-network-hack)
ETag [Cache-Control](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching)
This Page [https://viigit.github.io/schema-forms/](https://viigit.github.io/schema-forms/)

<script> 
    var options = {theme: 'simple'};
    $(".diagram").sequenceDiagram(options);
</script>
