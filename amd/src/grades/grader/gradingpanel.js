// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Grading panel for gradingform_checklist.
 *
 * @module     gradingform_checklist/grades/grader/gradingpanel
 * @copyright  Copyright (c) 2023 Open LMS (https://www.openlms.net)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {call as fetchMany} from 'core/ajax';
import {normaliseResult} from 'core_grades/grades/grader/gradingpanel/normalise';
import {compareData} from 'core_grades/grades/grader/gradingpanel/comparison';

// Note: We use jQuery.serializer here until we can rewrite Ajax to use XHR.send()
import jQuery from 'jquery';

/**
 * Initializes benchmark panel/modal controls inside a checklist root.
 *
 * @param {String|null} rootSelector Root selector, or null to bind to the document.
 * @param {String} closeLabel Accessible label for close controls.
 */
export const initBenchmarkDisplay = (rootSelector, closeLabel) => {
    const root = rootSelector ? jQuery(rootSelector) : jQuery(document);
    if (!root.length) {
        return;
    }

    let activeButton = null;
    let activeTarget = null;
    const label = closeLabel || 'Close';
    const escapeAttribute = value => String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    }[character]));
    const closeLabelAttribute = escapeAttribute(label);

    const closeBenchmark = () => {
        if (!activeTarget) {
            return;
        }
        activeTarget.addClass('hiddenelement').removeClass('open').attr('aria-hidden', 'true');
        activeTarget.find('.benchmark-modal-body, .benchmark-panel-body').empty();
        root.find('.benchmark-toggle').attr('aria-expanded', 'false');
        jQuery('body').removeClass('gradingform_checklist-benchmark-panel-open');
        if (activeButton && activeButton.length) {
            activeButton.get(0).focus();
        }
        activeButton = null;
        activeTarget = null;
    };

    const createDisplayTarget = (container, constrained) => {
        let target = container.find('.gradingform_checklist-benchmark-' + (constrained ? 'modal' : 'panel'));
        if (target.length) {
            return target;
        }

        if (constrained) {
            const modal = '<div class="gradingform_checklist-benchmark-modal hiddenelement" ' +
                'role="dialog" aria-modal="true" aria-hidden="true" tabindex="-1">' +
                '<div class="benchmark-modal-dialog"><button type="button" ' +
                'class="benchmark-modal-close" aria-label="' + closeLabelAttribute + '">&times;</button>' +
                '<h5 class="benchmark-display-title"></h5><div class="benchmark-modal-body"></div>' +
                '</div></div>';
            container.append(modal);
            target = container.find('.gradingform_checklist-benchmark-modal');
        } else {
            const panel = '<aside class="gradingform_checklist-benchmark-panel hiddenelement" ' +
                'role="complementary" aria-hidden="true" tabindex="-1">' +
                '<button type="button" class="benchmark-panel-close" aria-label="' + closeLabelAttribute + '">&times;</button>' +
                '<h5 class="benchmark-display-title"></h5><div class="benchmark-panel-body"></div></aside>';
            container.append(panel);
            target = container.find('.gradingform_checklist-benchmark-panel');
        }

        target.find('.benchmark-modal-close, .benchmark-panel-close').on('click', closeBenchmark);
        target.on('keydown.gradingformChecklistBenchmark', event => {
            if (event.key === 'Escape') {
                event.preventDefault();
                closeBenchmark();
            }
        });

        return target;
    };

    root.off('click.gradingformChecklistBenchmark', '.benchmark-toggle');
    root.on('click.gradingformChecklistBenchmark', '.benchmark-toggle', function(event) {
        event.preventDefault();
        event.stopPropagation();

        const button = jQuery(this);
        let container = button.closest('form');
        if (!container.length) {
            container = button.closest('.gradingform_checklist');
        }
        if (!container.length) {
            container = rootSelector ? root : jQuery('body');
        }

        const benchmarkId = button.data('benchmark-id');
        let source = container.find('[data-benchmark-content="' + benchmarkId + '"]').first();
        if (!source.length) {
            source = root.find('[data-benchmark-content="' + benchmarkId + '"]').first();
        }
        const title = source.find('.benchmark-content-title').text();
        const body = source.find('.benchmark-content-body').html();
        const constrained = window.innerWidth < 1100 ||
            jQuery('[data-region="pdf"], .assignfeedback_editpdf_widget, .drawingregion, [data-region="review-panel"]').length > 0;
        const target = createDisplayTarget(container, constrained);
        const currentBenchmark = String(benchmarkId);
        const isOpen = constrained ? !target.hasClass('hiddenelement') : target.hasClass('open');

        if (isOpen && target.attr('data-current-benchmark') === currentBenchmark) {
            closeBenchmark();
            return;
        }

        if (activeTarget && activeTarget[0] !== target[0]) {
            closeBenchmark();
        }
        root.find('.benchmark-toggle').attr('aria-expanded', 'false');
        button.attr('aria-expanded', 'true');
        activeButton = button;
        activeTarget = target;
        target.attr('data-current-benchmark', currentBenchmark);
        target.attr('aria-hidden', 'false');

        if (constrained) {
            jQuery('body').removeClass('gradingform_checklist-benchmark-panel-open');
            target.find('.benchmark-display-title').text(title);
            target.find('.benchmark-modal-body').html(body);
            target.removeClass('hiddenelement');
        } else {
            target.find('.benchmark-display-title').text(title);
            target.find('.benchmark-panel-body').html(body);
            target.removeClass('hiddenelement').addClass('open');
            jQuery('body').addClass('gradingform_checklist-benchmark-panel-open');
        }

        const focusBenchmarkClose = () => {
            const closeButton = target.find('.benchmark-modal-close, .benchmark-panel-close').get(0);
            if (closeButton) {
                closeButton.focus();
            }
        };
        focusBenchmarkClose();
        window.requestAnimationFrame(focusBenchmarkClose);
        window.setTimeout(focusBenchmarkClose, 100);
        window.setTimeout(focusBenchmarkClose, 300);
    });
};

/**
 * For a given component, contextid, itemname & gradeduserid we can fetch the currently assigned grade.
 *
 * @param {String} component
 * @param {Number} contextid
 * @param {String} itemname
 * @param {Number} gradeduserid
 *
 * @returns {Promise}
 */
export const fetchCurrentGrade = (component, contextid, itemname, gradeduserid) => {
    return fetchMany([{
        methodname: `gradingform_checklist_grader_gradingpanel_fetch`,
        args: {
            component,
            contextid,
            itemname,
            gradeduserid,
        },
    }])[0];
};

/**
 * For a given component, contextid, itemname & gradeduserid we can store the currently assigned grade in a given form.
 *
 * @param {String} component
 * @param {Number} contextid
 * @param {String} itemname
 * @param {Number} gradeduserid
 * @param {Boolean} notifyUser
 * @param {HTMLElement} rootNode
 *
 * @returns {Promise}
 */
export const storeCurrentGrade = async(component, contextid, itemname, gradeduserid, notifyUser, rootNode) => {
    const form = rootNode.querySelector('form');

    if (compareData(form) === true) {
        return normaliseResult(await fetchMany([{
            methodname: `gradingform_checklist_grader_gradingpanel_store`,
            args: {
                component,
                contextid,
                itemname,
                gradeduserid,
                notifyuser: notifyUser,
                formdata: jQuery(form).serialize(),
            },
        }])[0]);
    } else {
        return '';
    }
};
