import notifier from 'node-notifier';

let previouslyFailed = false;

export let envPlugin = {
	name: 'master-builder-esbuild-notifier',
	setup( build ) {
		build.onEnd( (res) => {
			if ( res.errors.length > 0 ) {
				const e = res.errors[0]; // don't spam OS, display first error only

				const title = 'master-builder: Error during esbuild 😓';
				const message = e.text;

				notifier.notify( {
					'app-name': 'my app',
					title,
					message,
				} );
				previouslyFailed = true;
			} else if( previouslyFailed ) {
				notifier.notify( {
					'app-name': 'my app',
					title: "🚀 Success!",
					message: "Compiled Successfully!!",
				} );

				previouslyFailed = false;
			}
		} );
	}
}
