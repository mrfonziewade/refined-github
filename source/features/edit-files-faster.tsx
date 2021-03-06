import './edit-files-faster.css';
import React from 'dom-chef';
import select from 'select-dom';
import PencilIcon from 'octicon/pencil.svg';
import * as pageDetect from 'github-url-detection';

import {wrap} from '../helpers/dom-utils';
import features from '.';
import parseRoute from '../github-helpers/parse-route';
import getDefaultBranch from '../github-helpers/get-default-branch';
import onFileListUpdate from '../github-events/on-file-list-update';

async function init(): Promise<void> {
	const defaultBranch = await getDefaultBranch();
	const isPermalink = /Tag|Tree/.test(select('.branch-select-menu i')!.textContent!);
	for (const fileIcon of select.all('.files :not(a) > .octicon-file')) {
		const {pathname} = fileIcon.closest('tr')!.querySelector<HTMLAnchorElement>('.js-navigation-open')!;
		const path = parseRoute(pathname);
		path.route = 'edit'; // Replaces /blob/
		if (isPermalink) {
			path.branch = defaultBranch; // Replaces /${tag|commit}/
		}

		wrap(fileIcon, <a href={path.toString()} className="rgh-edit-files-faster"/>);
		fileIcon.after(<PencilIcon/>);
	}
}

features.add({
	id: __filebasename,
	description: 'Adds a button to edit files from the repo file list.',
	screenshot: 'https://user-images.githubusercontent.com/1402241/56370462-d51cde00-622d-11e9-8cd3-8a173bd3dc08.png'
}, {
	include: [
		pageDetect.isRepoTree
	],
	additionalListeners: [
		onFileListUpdate
	],
	init
});
