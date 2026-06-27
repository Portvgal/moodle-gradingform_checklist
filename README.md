# Checklist Grading Form

The Checklist advanced grading method lets teachers define a list of criteria and
the point value for each criterion. It provides a consistent way to grade students
in Moodle activities that support advanced grading, including assignments and
forums.

Final grades entered through the checklist are added to the Gradebook.

This plugin was originally contributed by the Open LMS Product Development team.
Open LMS is an education technology company dedicated to bringing excellent
online teaching to institutions across the globe. Open LMS serves colleges,
universities, schools, and organizations by supporting the software educators use
to manage and deliver instructional content to learners in virtual classrooms.

## Recent Changes in This Fork

The current fork adds checklist authoring and grading improvements by John Braz
([@Portvgal](https://github.com/Portvgal)).
These changes extend the original plugin rather than replacing its core grading
model.

The original plugin provided:

- Checklist groups and checklist items.
- Per-item point values.
- Advanced grading integration for supported Moodle activities.
- Optional display of checklist points and remarks.
- Group-level editing and grading workflows.

This fork adds:

- Longer, multiline group descriptions and item definitions.
- Grader controls to select or unselect all checklist items.
- Required-comment rules for checked checklist items and groups.
- A custom heading for group-level comments.
- Item-level move up and move down controls.
- Grader panel option, validation, template, JavaScript, and styling updates.
- A Moodle privacy provider declaration.
- Expanded PHPUnit and Behat coverage.

## Installation

Extract the contents of the plugin into `_wwwroot_/grade/grading/form/checklist`
then visit `admin/upgrade.php` or use the CLI upgrade script.

For more information about the configuration and usage, please see http://docs.moodle.org/dev/Checklist

## Checklist Authoring Changes

Checklist authors can:

- Add group descriptions with up to 500 characters.
- Add item definitions with up to 1000 characters.
- Use multiline text in group descriptions and item definitions.
- Reorder checklist groups.
- Reorder individual checklist items with move up and move down controls.
- Configure a custom heading for group-level comments.

## Grading Option Changes

Checklist definitions can enable these grading options:

- Allow graders to select or unselect all checklist items in one action.
- Show item points while grading.
- Show item points to the user being graded.
- Allow item-level remarks.
- Allow group-level remarks.
- Show remarks to the user being graded.
- Require a comment for every checked item.
- Require at least one item comment when any item is checked.
- Require a group comment for every group with checked items.
- Require at least one group comment when any item is checked.

Required-comment options automatically make the related item or group remark
fields available during grading.

## Grader Panel

The grader panel supports the checklist options above, including bulk select and
unselect controls, item and group remark visibility, custom group comment
headings, and required-comment validation before storing grades.

## Privacy

This plugin declares a null privacy provider. It does not store personal data
directly.

## License
Copyright (c) 2021 Open LMS (https://www.openlms.net)

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program.  If not, see <http://www.gnu.org/licenses/>.
