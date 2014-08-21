'use strict';

~function(){
	var promoted = {};

	function promote( node ){
		var nodeName = node.nodeName;

		if( promoted[ nodeName ] ){ return; }

		var promoteRules = []
		  , stylesheets  = node.querySelectorAll( '::shadow style' )
		  ;

		// if the stylesheets have not been moved
		if( stylesheets.length ){
			[].forEach.call( stylesheets, function( stylesheet ){
				[].forEach.call( stylesheet.sheet.cssRules, function( rule ){
					if( rule.cssText.indexOf( 'body ' ) === 0 ){
						promoteRules.push( rule.cssText );
					}
				} );
			} );

		// if they've been moved to <head>
		}else{
			stylesheets = document.querySelectorAll( 'style[shim-shadowdom-css]' );
			var nodeRx = new RegExp( '^\\s*' + nodeName + '\\s+body\\s+', 'gim' );

			[].forEach.call( stylesheets, function( stylesheet ){
				stylesheet.innerHTML = stylesheet.innerHTML.replace( nodeRx, '' );
			} );
		}

		if( promoteRules.length ){
			var stylesheet = document.createElement( 'style' );
			stylesheet.innerHTML = '/* Inserted from polymer element ' + nodeName + ' */\n' + promoteRules.join( '' );

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