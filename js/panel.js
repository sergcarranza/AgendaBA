//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Responsive presentation and behavior for HTML data panels
//>>label: Panel
//>>group: Widgets
//>>css.structure: ../css/structure/jquery.mobile.panel.css
//>>css.theme: ../css/themes/default/jquery.mobile.theme.css

//define( [ "jquery", "../jquery.mobile.widget", "./page", "./page.sections" ], function( $ ) {
//>>excludeEnd("jqmBuildExclude");
(function( $, undefined ) {

$.widget( "mobile.panel", $.mobile.widget, {
	options: {
		classes: {
			panel: "ui-panel",
			panelOpen: "ui-panel-open",
			panelClosed: "ui-panel-closed",
			panelFixed: "ui-panel-fixed",
			panelInner: "ui-panel-inner",
			modal: "ui-panel-dismiss",
			modalOpen: "ui-panel-dismiss-open",
			pagePanel: "ui-page-panel",
			pagePanelOpen: "ui-page-panel-open",
			contentWrap: "ui-panel-content-wrap",
			contentWrapOpen: "ui-panel-content-wrap-open",
			contentWrapClosed: "ui-panel-content-wrap-closed",
			contentFixedToolbar: "ui-panel-content-fixed-toolbar",
			contentFixedToolbarOpen: "ui-panel-content-fixed-toolbar-open",
			contentFixedToolbarClosed: "ui-panel-content-fixed-toolbar-closed",
			animate: "ui-panel-animate",
			modalOpaque: "background-opaque",
			modalBright: "background-bright",
			panelFixedButtonsTop: "ui-panel-fixed-buttons-scrollable-top",
			panelFixedButtonsBottom: "ui-panel-fixed-buttons-bottom",
			panelFixedButton: "panel-fixed-button"
		},
		animate: true,
		theme: null,
		position: "left",
		dismissible: true,
		display: "reveal", //accepts reveal, push, overlay
		initSelector: ":jqmData(role='panel')",
		swipeClose: true,
		positionFixed: false,
		darkModal: false
	},

	_panelID: null,
	_closeLink: null,
	_page: null,
	_modal: null,
	_panelInner: null,
	_wrapper: null,
	_fixedToolbar: null,
	_fixedPanelBtn: null,

	_create: function() {
		var self = this,
			$el = self.element,
			page = $el.closest( ":jqmData(role='page')" ),
			_getPageTheme = function() {
				var $theme = $.data( page[0], "mobilePage" ).options.theme,
				$pageThemeClass = "ui-body-" + $theme;
				return $pageThemeClass;
			},
			_getPanelInner = function() {
				var $panelInner = $el.find( "." + self.options.classes.panelInner );
				if ( $panelInner.length === 0 ) {
					$panelInner = $el.children().not(":jqmData(role='fixedpanelbutton')").wrapAll( '<div class="' + self.options.classes.panelInner + '" />' ).parent();
				}
				return $panelInner;
			},
			_getWrapper = function() {
				var $wrapper = page.find( "." + self.options.classes.contentWrap );
				if ( $wrapper.length === 0 ) {
					$wrapper = page.children( ".ui-header:not(:jqmData(position='fixed')), .ui-content:not(:jqmData(role='popup')), .ui-footer:not(:jqmData(position='fixed'))" ).wrapAll( '<div class="' + self.options.classes.contentWrap + ' ' + _getPageTheme() + '" />' ).parent();
					if ( $.support.cssTransform3d && !!self.options.animate ) {
						$wrapper.addClass( self.options.classes.animate );
					}
				}
				return $wrapper;
			},
			_getFixedToolbar = function() {
				var $fixedToolbar = page.find( "." + self.options.classes.contentFixedToolbar );
				if ( $fixedToolbar.length === 0 ) {
					$fixedToolbar = page.find( ".ui-header:jqmData(position='fixed'), .ui-footer:jqmData(position='fixed')" ).addClass( self.options.classes.contentFixedToolbar );
					if ( $.support.cssTransform3d && !!self.options.animate ) {
						$fixedToolbar.addClass( self.options.classes.animate );
					}
				}
				return $fixedToolbar;
			};

		// expose some private props to other methods
		$.extend( this, {
			_panelID: $el.attr( "id" ),
			_closeLink: $el.find( ":jqmData(rel='close')" ),
			_page: $el.closest( ":jqmData(role='page')" ),
			_pageTheme: _getPageTheme(),
			_panelInner: _getPanelInner(),
			_wrapper: _getWrapper(),
			_fixedToolbar: _getFixedToolbar()
		});
		
		// if there is a fixed panel button wrap the content with two separate divs
		var $fixedPanelBtn = $el.find(":jqmData(role='fixedpanelbutton')");
		if($fixedPanelBtn.length != 0){
			self._panelInner.wrapAll( '<div class="' + self.options.classes.panelFixedButtonsTop + '" />');
			$fixedPanelBtn.addClass( self.options.classes.panelFixedButtonsBottom )
				.children().wrapAll('<div class="' + self.options.classes.panelInner + '" />');	
			self._fixedPanelBtn = $fixedPanelBtn;
			self.element.addClass( self.options.classes.panelFixedButton );
		}

		self._addPanelClasses();
		self._wrapper.addClass( this.options.classes.contentWrapClosed );
		self._fixedToolbar.addClass( this.options.classes.contentFixedToolbarClosed );
		// add class to page so we can set "overflow-x: hidden;" for it to fix Android zoom issue
		self._page.addClass( self.options.classes.pagePanel );
		
		// if animating, add the class to do so
		if ( $.support.cssTransform3d && !!self.options.animate ) {
			this.element.addClass( self.options.classes.animate );
		}
		
		//set fixed position if panel is on top or bottom
		if ( self.options.position == 'top' || self.options.position == 'bottom' ){
			self.options.positionFixed = 'true';
		}

		self._bindUpdateLayout();
		self._bindCloseEvents();
		self._bindLinkListeners();
		self._bindPageEvents();

		if ( !!self.options.dismissible ) {
			self._createModal();
		}

		self._bindSwipeEvents();

	},

	_createModal: function( options ) {
		var self = this;
		
		self._modal = $( "<div class='" + self.options.classes.modal + "' data-panelid='" + self._panelID + "'></div>" )
			.on( "mousedown", function() {
				self.close();
			})
			.appendTo( this._page );
	},

	_getPosDisplayClasses: function( prefix ) {
		return prefix + "-position-" + this.options.position + " " + prefix + "-display-" + this.options.display;
	},

	_getPanelClasses: function() {
		var panelClasses = this.options.classes.panel +
			" " + this._getPosDisplayClasses( this.options.classes.panel ) +
			" " + this.options.classes.panelClosed;

		if ( this.options.theme ) {
			panelClasses += " ui-body-" + this.options.theme;
		}
		if ( !!this.options.positionFixed ) {
			panelClasses += " " + this.options.classes.panelFixed;
		}
		return panelClasses;
	},

	_addPanelClasses: function() {
		this.element.addClass( this._getPanelClasses() );
	},

	_bindCloseEvents: function() {
		var self = this;
		
		self._closeLink.on( "click.panel" , function( e ) {
			e.preventDefault();
			self.close();
			return false;
		});
		self.element.on( "click.panel" , "a:jqmData(ajax='false')", function( e ) {
			self.close();
		});		
	},

	_positionPanel: function() {
		var self = this,
			panelHeight = self.element.height();

		//adjust the height of the scrollable area
		self._setPanelAreaInnerHeight( panelHeight );

		var	panelInnerHeight = self._panelInner.outerHeight(),
			expand = panelInnerHeight > $.mobile.getScreenHeight();

		if( self.options.position === "top" ){
			var panelHeight = self.element.height();
			self._setVerticalCssTransform( self._wrapper, panelHeight );
		}

		if ( expand || !self.options.positionFixed ) {
			if ( expand ) {
				self._unfixPanel();
				$.mobile.resetActivePageHeight( panelInnerHeight );
			}
			self._scrollIntoView( panelInnerHeight );
		} else {
			self._fixPanel();
		}
	},

	_scrollIntoView: function( panelInnerHeight ) {
		if ( panelInnerHeight < $( window ).scrollTop() ) {
			window.scrollTo( 0, 0 );
		}	
	},

	_bindFixListener: function() {
		this._on( $( window ), { "throttledresize": "_positionPanel" });
	},

	_unbindFixListener: function() {
		this._off( $( window ), "throttledresize" );
	},

	_unfixPanel: function() {
		if ( !!this.options.positionFixed && $.support.fixedPosition ) {
			this.element.removeClass( this.options.classes.panelFixed );
		}
	},

	_fixPanel: function() {
		if ( !!this.options.positionFixed && $.support.fixedPosition ) {
			this.element.addClass( this.options.classes.panelFixed );
		}
	},
	
	_bindUpdateLayout: function() {
		var self = this;
		
		self.element.on( "updatelayout", function( e ) {
			if ( self._open ) {
				self._positionPanel();
			}
		});
	},

	_bindLinkListeners: function() {
		var self = this;

		self._page.on( "click.panel" , "a", function( e ) {
			if ( this.href.split( "#" )[ 1 ] === self._panelID && self._panelID !== undefined ) {
				e.preventDefault();
				var $link = $( this );
				if ( ! $link.hasClass( "ui-link" ) ) {
					$link.addClass( $.mobile.activeBtnClass );
					self.element.one( "panelopen panelclose", function() {
						$link.removeClass( $.mobile.activeBtnClass );
					});
				}
				self.toggle();
				return false;
			}
		});
	},
	
	_bindSwipeEvents: function() {
		var self = this,
			area = self._modal ? self.element.add( self._modal ) : self.element;
		
		if( self._fixedPanelBtn != null ){
			self._fixedPanelBtn.on( "scrollstart", function( e ){
				e.preventDefault();
			});
		}

		// on swipe, close the panel
		if( !!self.options.swipeClose ) {
			
			self._modal.on( "scrollstart.panel", function( e ){
				e.preventDefault();		//prevent scrolling
				self.close();
			});
			if ( self.options.position === "left" ) {
				area.on( "swipeleft.panel", function( e ) {
					self.close();
				});
			} else if( self.options.position === "top" || self.options.position === 'bottom' ){
				self.element.on( "scrollstart.panel", function( e ){
					e.preventDefault();
				});
			} else {
				area.on( "swiperight.panel", function( e ) {
					self.close();
				});
			}
		}
	},

	_bindPageEvents: function() {
		var self = this;
			
		self._page
			// Close the panel if another panel on the page opens
			.on( "panelbeforeopen", function( e ) {
				if ( self._open && e.target !== self.element[ 0 ] ) {
					self.close();
				}
			})
			// clean up open panels after page hide
			.on( "pagehide", function( e ) {
				if ( self._open ) {
					self.close( true );
				}
			})
			// on escape, close? might need to have a target check too...
			.on( "keyup.panel", function( e ) {
				if ( e.keyCode === 27 && self._open ) {
					self.close();
				}
			});
	},

	// state storage of open or closed
	_open: false,

	_contentWrapOpenClasses: null,
	_fixedToolbarOpenClasses: null,
	_modalOpenClasses: null,
	
	_setVerticalCssTransform: function( element, distance ) {
		element.css(
			{
				'-webkit-transform': 'translate3d(0,' + distance  +'px,0)',
				'-moz-transform':'translate3d(0,' + distance + 'px,0)',
				'transform':'translate3d(0,' + distance + 'px,0)'
			}
		);
	},
	
	_resetCssTransform: function( element ){
		element.css(
			{
				'-webkit-transform': '',
				'-moz-transform':'',
				'transform':''
			}
		);
	},
	_setPanelAreaInnerHeight: function( panelHeight ){
		var self = this;
		//adjust the scrollable area height only if there are fixed buttons
		if( self._fixedPanelBtn != null ){
			var areaHeight = panelHeight - self._fixedPanelBtn.height();
			self._panelInner.parent().css( 'height',areaHeight );
		}
	},

	open: function( immediate ) {
		if ( !this._open ) {
			var self = this,
				o = self.options,
				_openPanel = function() {
					self._page.off( "panelclose" );
					self._page.jqmData( "panel", "open" );
					
					self.element.removeClass( o.classes.panelClosed ).addClass( o.classes.panelOpen );
					var panelHeight = self.element.height();

					//adjust the height of the scrollable area
					self._setPanelAreaInnerHeight( panelHeight );

					if ( !immediate && $.support.cssTransform3d && !!o.animate ) {
						self.element.add( self._wrapper ).on( self._transitionEndEvents, complete );

						//css transform to open top and bottom panels
						if( self.options.position === 'top' || self.options.position === 'bottom'){
							self._setVerticalCssTransform( self.element, 0);  
						}

						//css transform for page content when top panel opens in push mode
						if( self.options.position === 'top' && self.options.display ==="push"  ){
							self._setVerticalCssTransform( self._wrapper , panelHeight );
							self._setVerticalCssTransform( self._fixedToolbar , panelHeight );
						}else if( self.options.position === 'bottom' && self.options.display === "push" ){
							self._setVerticalCssTransform( self._wrapper , -panelHeight );
							self._setVerticalCssTransform( self._fixedToolbar , -panelHeight );						
						}
					} else {
						setTimeout( complete, 0 );

						//move the main content up or down when display mode is push
						if( self.options.display === 'push'){
							if( self.options.position === 'top' ){
								self._wrapper.css('top', panelHeight+"px"); 
							}else if( self.options.position === 'bottom' ){
								self._wrapper.css('bottom', panelHeight+"px"); 
							}
						}
					}
					
					if ( self.options.theme && self.options.display !== "overlay" ) {
						self._page
							.removeClass( self._pageTheme )
							.addClass( "ui-body-" + self.options.theme );
					}

					self._contentWrapOpenClasses = self._getPosDisplayClasses( o.classes.contentWrap );
					self._wrapper
						.removeClass( o.classes.contentWrapClosed )
						.addClass( self._contentWrapOpenClasses + " " + o.classes.contentWrapOpen );
						
					self._fixedToolbarOpenClasses = self._getPosDisplayClasses( o.classes.contentFixedToolbar );
					self._fixedToolbar
						.removeClass( o.classes.contentFixedToolbarClosed )
						.addClass( self._fixedToolbarOpenClasses + " " + o.classes.contentFixedToolbarOpen );
						
					self._modalOpenClasses = self._getPosDisplayClasses( o.classes.modal ) + " " + o.classes.modalOpen;
					
					if ( self._modal ) {
						self._modal.addClass( self._modalOpenClasses );
						if( self.options.darkModal ){
							 //add an opacity transition		
							self._modal.removeClass( o.classes.modalBright ).addClass( o.classes.modalOpaque );
						}
					}
				},
				complete = function() {
					self.element.add( self._wrapper ).off( self._transitionEndEvents, complete );

					self._page.addClass( o.classes.pagePanelOpen );
					
					self._positionPanel();
					self._bindFixListener();
					
					self._trigger( "open" );
				};

			if ( this.element.closest( ".ui-page-active" ).length < 0 ) {
				immediate = true;
			}
			
			self._trigger( "beforeopen" );
			
			if ( self._page.jqmData('panel') === "open" ) {
				self._page.on( "panelclose", function() {
					_openPanel();
				});
			} else {
				_openPanel();
			}
			
			self._open = true;
		}
	},

	close: function( immediate ) {
		if ( this._open ) {
			var o = this.options,
				self = this,
				_closePanel = function() {

					self.element.removeClass( o.classes.panelOpen );

					var panelHeight = self.element.height();

					if ( !immediate && $.support.cssTransform3d && !!o.animate ) {
						self.element.add( self._wrapper ).on( self._transitionEndEvents, complete );
						//css transform for top and bottom panels when closed
						if( self.options.position === 'top' ){
							self._setVerticalCssTransform( self.element , -panelHeight );
						}else if ( self.options.position === 'bottom' ){

							self._setVerticalCssTransform( self.element , panelHeight );
						}

						self._wrapper.removeClass( o.classes.contentWrapOpen );

						//css transform for page content when top or bottom panel close in push mode
						if( self.options.position === 'top' || self.options.position === 'bottom' ){
							if( self.options.display === "push" ){
								self._resetCssTransform( self._wrapper );
								self._resetCssTransform( self._fixedToolbar );
							}
						}
					} else {
						setTimeout( complete, 0 );
						if( self.options.position === 'top' ){
							self._wrapper.css('top', ""); 
						}else if( self.options.position === 'bottom' ){
							self._wrapper.css('bottom', ""); 
						} 
					}
					
					self._page.removeClass( o.classes.pagePanelOpen );
					

					

					self._fixedToolbar.removeClass( o.classes.contentFixedToolbarOpen );
					
					if ( self._modal ) {
						if( self.options.darkModal ){
							//remove opacity transition
							self._modal.removeClass( o.classes.modalOpaque );
						}
							self._modal.removeClass( self._modalOpenClasses ).addClass( o.classes.modalBright );	
					}
				},
				complete = function() {
					if ( self.options.theme && self.options.display !== "overlay" ) {
						self._page.removeClass( "ui-body-" + self.options.theme ).addClass( self._pageTheme );
					}
					self.element.add( self._wrapper ).off( self._transitionEndEvents, complete );
					self.element.addClass( o.classes.panelClosed );
					
					self._wrapper
						.removeClass( self._contentWrapOpenClasses )
						.addClass( o.classes.contentWrapClosed );
						
					self._fixedToolbar
						.removeClass( self._fixedToolbarOpenClasses )
						.addClass( o.classes.contentFixedToolbarClosed );
						
					self._fixPanel();
					self._unbindFixListener();
					$.mobile.resetActivePageHeight();
					
					self._page.jqmRemoveData( "panel" );
					self._trigger( "close" );
				};
				
			if ( this.element.closest( ".ui-page-active" ).length < 0 ) {
				immediate = true;
			}
			self._trigger( "beforeclose" );

			_closePanel();

			self._open = false;
		}
	},

	toggle: function( options ) {
		this[ this._open ? "close" : "open" ]();
	},

	_transitionEndEvents: "webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd",

	_destroy: function() {
		var classes = this.options.classes,
			theme = this.options.theme,
			hasOtherSiblingPanels = this.element.siblings( "." + classes.panel ).length;

		// create
		if ( !hasOtherSiblingPanels ) {
			this._wrapper.children().unwrap();
			this._page.find( "a" ).unbind( "panelopen panelclose" );
			this._page.removeClass( classes.pagePanel );
			if ( this._open ) {
				this._page.jqmRemoveData( "panel" );
				this._page.removeClass( classes.pagePanelOpen );
				if ( theme ) {
					this._page.removeClass( "ui-body-" + theme ).addClass( this._pageTheme );
				}
				$.mobile.resetActivePageHeight();
			}
		} else if ( this._open ) {
			this._wrapper.removeClass( classes.contentWrapOpen );
			this._fixedToolbar.removeClass( classes.contentFixedToolbarOpen );
			this._page.jqmRemoveData( "panel" );
			this._page.removeClass( classes.pagePanelOpen );
			if ( theme ) {
				this._page.removeClass( "ui-body-" + theme ).addClass( this._pageTheme );
			}
		}
		
		this._panelInner.children().unwrap();

		this.element.removeClass( [ this._getPanelClasses(), classes.panelAnimate ].join( " " ) )
			.off( "swipeleft.panel swiperight.panel scrollstart.panel" )
			.off( "panelbeforeopen" )
			.off( "panelhide" )
			.off( "keyup.panel" )
			.off( "updatelayout" );

		this._closeLink.off( "click.panel" );

		if ( this._modal ) {
			this._modal.remove();
		}

		// open and close
		this.element.off( this._transitionEndEvents )
			.removeClass( [ classes.panelUnfixed, classes.panelClosed, classes.panelOpen ].join( " " ) );
	}
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.panel.prototype.enhanceWithin( e.target );
});

})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//});
//>>excludeEnd("jqmBuildExclude");