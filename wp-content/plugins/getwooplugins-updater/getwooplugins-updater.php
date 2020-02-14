<?php
	/**
	 * Plugin Name: GetWooPlugins Updater
	 * Plugin URI: https://getwooplugins.com/
	 * Description: A Helper plugin to check automatic updates of your GetWooPlugins.com plugins.
	 * Author: Emran Ahmed
	 * Version: 1.0.0
	 * Requires at least: 4.8
	 * Tested up to: 4.9
	 * Author URI: https://getwooplugins.com/
	 */
	
	defined( 'ABSPATH' ) or die( 'Keep Silent' );
	
	if ( ! class_exists( 'GetWooPlugins_Updater' ) ):
		final class GetWooPlugins_Updater {
			
			private $update_path = 'https://getwooplugins.com/wp-json/getwooplugins/v1/check-update';
			public  $plugin_slug;
			public  $slug;
			public  $product_id;
			public  $license_key;
			public  $plugin_data;
			public  $args        = array();
			private $current_version;
			
			public function __construct( $plugin_file, $license_key, $args = array() ) {
				
				$this->plugin_slug     = plugin_basename( $plugin_file );
				$this->license_key     = $license_key;
				$this->args            = wp_parse_args( $args, array(
					'domain' => strtolower( $_SERVER[ 'HTTP_HOST' ] ),
					'theme'  => basename( get_template_directory() )
				) );
				$this->plugin_data     = get_plugin_data( $plugin_file );
				$this->current_version = $this->plugin_data[ 'Version' ];
				$this->slug            = basename( dirname( $plugin_file ) );
				
				add_filter( 'pre_set_site_transient_update_plugins', array( $this, 'check_update' ) );
				add_filter( 'plugins_api', array( $this, 'check_details_info' ), 10, 3 );
				add_action( "in_plugin_update_message-{$this->plugin_slug}", array( $this, "update_message" ), 10 );
			}
			
			public function check_update( $transient ) {
				
				if ( empty( $transient->checked ) ) {
					return $transient;
				}
				
				$remote_version = $this->get_version_info();
				
				if ( ! empty( $remote_version ) && version_compare( $this->current_version, $remote_version->new_version, '<' ) ) {
					$information              = new stdClass;
					$information->slug        = $this->slug;
					$information->new_version = $remote_version->new_version;
					$information->url         = $remote_version->url;
					$information->plugin      = $this->plugin_slug;
					
					if ( isset( $remote_version->upgrade_notice ) ) {
						$information->upgrade_notice = $remote_version->upgrade_notice;
					}
					
					if ( isset( $remote_version->package ) ) {
						$information->package = $remote_version->package;
					}
					
					$transient->response[ $this->plugin_slug ] = $information;
				}
				
				return $transient;
			}
			
			public function request_params( $action ) {
				return array(
					'timeout' => 60,
					'body'    => array(
						'action'      => $action,
						'name'        => $this->slug,
						'type'        => 'plugins',
						'license_key' => $this->license_key,
						'args'        => $this->args
					)
				);
			}
			
			public function get_response( $request_type = 'version-info' ) {
				$params   = $this->request_params( $request_type );
				$response = wp_remote_get( $this->update_path, $params );
				
				if ( ! is_wp_error( $response ) || wp_remote_retrieve_response_code( $response ) == 200 ) {
					return maybe_unserialize( json_decode( wp_remote_retrieve_body( $response ) ) );
				}
				
				return FALSE;
			}
			
			public function get_version_info() {
				return $this->get_response( 'version-info' );
			}
			
			public function get_details_info() {
				return $this->get_response( 'details-info' );
			}
			
			public function check_details_info( $def, $action, $arg ) {
				
				if ( ! ( 'plugin_information' === $action ) ) {
					return $def;
				}
				
				if ( $arg->slug === $this->slug ) {
					$information = $this->get_details_info();
					
					if ( $information && is_object( $information ) ) {
						$information->slug = $this->slug;
					}
					
					return $information;
				}
				
				return $def;
			}
			
			public function update_message( $plugin_data ) {
				if ( isset( $plugin_data[ 'upgrade_notice' ] ) && $plugin_data[ 'upgrade_notice' ] ) {
					echo ' ' . wp_kses_post( $plugin_data[ 'upgrade_notice' ] );
				}
			}
		}
	endif;