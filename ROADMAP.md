## Roadmap

#### Directive 'owners'

Who will take the lead regarding any pull requests or decisions for a a directive?

-----------------------------------------
| accordion         | @ajoslin          |
-----------------------------------------
| alert         | @pkozlowski           |
-----------------------------------------
| bindHtml         | frozen, use $sce?  |
-----------------------------------------
| buttons          |  @pkozlowski       |
-----------------------------------------
| carousel         | @ajoslin           |
-----------------------------------------
| collapse         | frozen, use $animate (@chrisirhc)
-----------------------------------------
| datepicker       | @bekos          |
-----------------------------------------
| dropdownToggle   | @bekos          |
-----------------------------------------
| modal            | @pkozlowski          |
-----------------------------------------
| pagination       | @bekos          |
-----------------------------------------
| popover/tooltip  | @chrisirhc          |
-----------------------------------------
| position         | @ajoslin          |
-----------------------------------------
| progressbar      | @bekos          |
-----------------------------------------
| rating           | @bekos          |
-----------------------------------------
| tabs             | @ajoslin          |
-----------------------------------------
| timepicker       | @ajoslin          |
-----------------------------------------
| transition       | @ajoslin          |
-----------------------------------------
| typeahead        | @ajoslin          |
-----------------------------------------

#### Attribute Prefix  

Each directive should make its own two-letter prefix

`<tab tb-active=”true” tb-select=”doThis()”>`

#### Use $animate

* @chrisirhc is leading this

#### New Build system

* @ajoslin is leading this
* Building everything on travis commit 
* Push to bower, nuget, cdnjs, etc

#### Switch to ngdocs

* http://github.com/petebacondarwin/angular-doc-gen

### Conventions for whether attributes/options should be watched/evaluated-once

- Boolean attributes
- Stick AngularJS conventions rather than Bootstrap conventions

