'use strict';

~function(){
	var promoted = {};

	function promote( node ){
		var nodeName = node.nodeName;

		if( promoted[ nodeName ] ){ return; }

		var promoteRules = [];

		[].forEach.call( node.querySelectorAll( '::shadow style' ), function( stylesheet ){
			[].forEach.call( stylesheet.sheet.cssRules, function( rule ){
				if( rule.cssText.indexOf( 'body ' ) === 0 ){
					promoteRules.push( rule.cssText );
				}
			} );
		} );

		if( promoteRules.length ){
			var stylesheet = document.createElement( 'style' );
			stylesheet.innerHTML = promoteRules.join( '' ) + '/* Inserted from polymer element ' + nodeName + ' */';

			document.getElementsByTagName( 'head' )[0].appendChild( stylesheet );
		}

		promoted[ nodeName ] = 1;
	}

	Polymer( 'promote-body-css', {
		attached : function( parent ){
			promote( ( parent = this.parentNode ).host || parent );
		}
	} );
}();