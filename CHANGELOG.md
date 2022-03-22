# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.4.0](https://gitlab.com/tms-elte/frontend-react/compare/v2.3.0...v2.4.0) (2022-03-22)


### Features

* check backend version requirement ([f81ca7f](https://gitlab.com/tms-elte/frontend-react/commit/f81ca7fc55b323583b8f9a673de29d7d77acbe51))
* Default status for Failed submissions is Rejected ([601dcf6](https://gitlab.com/tms-elte/frontend-react/commit/601dcf6f512a4a1ff23abad1987a003c5242ea2d))
* file upload support for automatic tester ([9e5cb22](https://gitlab.com/tms-elte/frontend-react/commit/9e5cb2226d2e67e7ba2d5a19bf0e082c18df50dd))


### Bug Fixes

* activating the automated tester resets the task deadlines ([5729574](https://gitlab.com/tms-elte/frontend-react/commit/57295743a6cef06ef8ad5dc01527c8f80c212478))
* Misleading error message upon oversized file upload ([faa4b26](https://gitlab.com/tms-elte/frontend-react/commit/faa4b266eb1b75dfe23b4f8f42ceea3891148dac))

## [2.3.0](https://gitlab.com/tms-elte/frontend-react/compare/v2.2.0...v2.3.0) (2022-02-06)


### Features

* command line arguments input for test cases ([4dfdcdf](https://gitlab.com/tms-elte/frontend-react/commit/4dfdcdf9ad3a91e2a2291e354c1d720a666bf2ee))

## [2.2.0](https://gitlab.com/tms-elte/frontend-react/compare/v2.1.0...v2.2.0) (2021-12-07)


### Features

* Add user settings page ([490b143](https://gitlab.com/tms-elte/frontend-react/commit/490b143d7eaf69e07280d606b8d7ed383f6144af))
* display finalized future exams ([b7341d0](https://gitlab.com/tms-elte/frontend-react/commit/b7341d0051686847fcd181d5c510154ace16d5b5))
* sort student submissions by grading and date ([56fd09c](https://gitlab.com/tms-elte/frontend-react/commit/56fd09cf044c6d2a470b747bd99673e9a41c1105))

## [2.1.0](https://gitlab.com/tms-elte/frontend-react/compare/v2.0.3...v2.1.0) (2021-10-27)


### Features

* add a Markdown editor on the instructor interface for the task description ([80831b6](https://gitlab.com/tms-elte/frontend-react/commit/80831b6c91021a2dbadfd68c2dc997befd8c3185))
* add insert table command to markdown editor ([3d1ef00](https://gitlab.com/tms-elte/frontend-react/commit/3d1ef00739001c2e15880c411d4376ba63f76bfd))
* add support for GitHub Flavoured Markdown ([4a39ea8](https://gitlab.com/tms-elte/frontend-react/commit/4a39ea8d970fcac48436b722ee77de4f5b046d5d))
* use Luxon and manage timezones ([075489f](https://gitlab.com/tms-elte/frontend-react/commit/075489fb5889facf9872bfeba5b0136283776f15))


### Bug Fixes

* automated evaluator result not shown for accepted and rejected submissions ([ea3b2dd](https://gitlab.com/tms-elte/frontend-react/commit/ea3b2ddf97456917cf6bfc26024537774ba4cdd4))

### [2.0.3](https://gitlab.com/tms-elte/frontend-react/compare/v2.0.2...v2.0.3) (2021-10-23)


### Bug Fixes

* cleanup intervals and timeouts in TestWriterPage.tsx correctly ([6f00de8](https://gitlab.com/tms-elte/frontend-react/commit/6f00de8a02e5925fb3f75b41ff3ce3f4b1a78c4f))
* display multiline plagiarism notes correctly ([63773a0](https://gitlab.com/tms-elte/frontend-react/commit/63773a03deafb249789fde0e8dd708f3a97cf4d2))
* display multiline submission notes correctly ([6afc292](https://gitlab.com/tms-elte/frontend-react/commit/6afc292cc0de06694f3096e4772613b6e7eee63c))
* QuestionFormModal nad AnswerFormModal components should clear form fields when the user adds a new question or answer ([04104d8](https://gitlab.com/tms-elte/frontend-react/commit/04104d824a0a7604c743659e4311079a54eb91ac))
* regular expressions are not escaped in DualListBoxControl.tsx ([2335b10](https://gitlab.com/tms-elte/frontend-react/commit/2335b102ef58ddc27aa49358907da7e2bad6b202))
* translation issue on dynamic content after page reload ([63b13b1](https://gitlab.com/tms-elte/frontend-react/commit/63b13b151bdfd7181d6c72976e3105360073caf4))

### [2.0.2](https://gitlab.com/tms-elte/frontend-react/compare/v2.0.1...v2.0.2) (2021-09-28)


### Bug Fixes

* show the file upload form for tasks where the submission is in late submission status ([d9666c4](https://gitlab.com/tms-elte/frontend-react/commit/d9666c413be01e6bf8c0eb9d21a1ccdef0c66c2f), [b8ea521](https://gitlab.com/tms-elte/frontend-react/commit/b8ea52154a9705e53680ce8511cc1bb751d7150a))

## 2.0.0 (2021-09-22)


Initial public release.
