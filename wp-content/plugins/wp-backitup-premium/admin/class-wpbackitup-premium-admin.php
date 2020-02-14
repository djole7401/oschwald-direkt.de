<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       http://www.wpbackitup.com
 * @since      1.14.0
 *
 * @package    WPBackitup_Premium
 * @subpackage WPBackitup_Premium/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    WPBackitup_Premium
 * @subpackage WPBackitup_Premium/admin
 * @author     Chris Simmons <chris@wpbackitup.com>
 */
class WPBackitup_Premium_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.14.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The path for the main plugin file
	 *
	 * @since    1.14.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_path;


	/**
	 * The version of this plugin.
	 *
	 * @since    1.14.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.14.0
	 *
	 * @param      string $plugin_name    The name of this plugin.
	 * @param      string $plugin_path    The path to the main plugin file
	 * @param      string $plugin_version The version of this plugin.
	 */
	public function __construct( $plugin_name, $plugin_path, $plugin_version ) {

		$this->plugin_name = $plugin_name;
		$this->plugin_path = $plugin_path;
		$this->version = $plugin_version;

		if (  is_multisite() ) {
			add_action( 'network_admin_menu', array( &$this, 'make_menu' ), 11 );
		} else {
			add_action( 'admin_menu', array( &$this, 'make_menu' ), 11 );
		}
	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.14.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in WPBackitup_Premium_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The WPBackitup_Premium_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/wp-backitup-premium-admin.min.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.14.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in WPBackitup_Premium_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The WPBackitup_Premium_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */
		wp_enqueue_script( $this->plugin_name . '_vue_premium_components', plugin_dir_url( __FILE__ ) . 'js/wp-backitup-premium-components.min.js', array( 'jquery' ), $this->version, false );
		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/wp-backitup-premium-admin.min.js', array( 'jquery' ), $this->version, false );

	}

	/**
	 * Add WPBackItUp Premium Menu Items
	 *
	 * @since    1.14.0
	 */
	public function make_menu() {

		add_submenu_page( WPBACKITUP__NAMESPACE, __('Restore', 'wp-backitup'), __('Restore','wp-backitup'), 'administrator', WPBACKITUP__NAMESPACE.'-restore', array(
				&$this,
				'admin_restore_page'
			)
		);

	}

	/**
	 * Reorder WP BackItUp main menu
	 *
	 * @since    1.14.0
	 */
	public function reorder_menu( $menu_ord ) {

		global $submenu;

		$arr      = array();
		$tmp_restore = array();

		//If the WPBackItUp Menu exists
		if (array_key_exists(WPBACKITUP__NAMESPACE, $submenu)) {

			foreach ( $submenu[WPBACKITUP__NAMESPACE] as $key => $menu ) {
				//Stash restore menu item in a variable
				if ( $menu[2] === WPBACKITUP__NAMESPACE."-restore" ) {
					$tmp_restore = $menu;
					unset( $submenu[WPBACKITUP__NAMESPACE][ $key ] );
				}

			}

			//Place restore option just above support
			foreach ( $submenu[WPBACKITUP__NAMESPACE] as $menu ) {
				if ( $menu[2] ===  WPBACKITUP__NAMESPACE."-support" ) {
					$arr[] = $tmp_restore;
					//$arr[] = $tmp_logs;
					$arr[] = $menu;
				} else {
					$arr[] = $menu;
				}
			}

			$submenu[WPBACKITUP__NAMESPACE] = $arr;
		}
		return $menu_ord;

	}

	/**
	 * The admin section restore page rendering method
	 *
	 * @since    1.14.0
	 *
	 */
	public  function admin_restore_page()
	{
		if( !current_user_can( 'manage_options' ) ) {
			wp_die( 'You do not have sufficient permissions to access this page.' );
		}

		include_once plugin_dir_path( __FILE__ )  . "partials/wpbackitup-premium-restore-display.php";
	}

	/**
	 * Action: Render Scheduler Widget
	 *
	 * @since    1.14.0
	 */
	public function render_scheduler_html(){
		if( !current_user_can( 'manage_options' ) ) {
			wp_die( 'You do not have sufficient permissions to access this page.' );
		}

		include_once plugin_dir_path( __FILE__ )  . "partials/wpbackitup-premium-scheduler-display.php";

	}

	/**
	 * Action: Render Premium Settings
	 *
	 * @since    1.14.0
	 */
	public function render_premium_settings(){
		if( !current_user_can( 'manage_options' ) ) {
			wp_die( 'You do not have sufficient permissions to access this page.' );
		}

		include_once plugin_dir_path( __FILE__ )  . "partials/wpbackitup-premium-settings.php";

	}


	/**
	 * Action: Render the license registration form
	 * @since    1.14.0
	 *
	 */
	public function render_license_registration_form (){

		if( !current_user_can( 'manage_options' ) ) {
			wp_die( 'You do not have sufficient permissions to access this page.' );
		}

		include_once plugin_dir_path( __FILE__ )  . "partials/wpbackitup-premium-license-registration-display.php";

	}


//	/**
//	 * Acion: Validate License Info Once per day
//      - moved to core
//	 *
//	 * @since    1.14.0
//	 *
//	 */
//	public function check_license($force_check=false){
//		$wpbackitup_license = new WPBackItUp_License();
//
//		//Get License Info
//		$license_key=$wpbackitup_license->get_license_key();
//		$license_product_id=$wpbackitup_license->get_license_product_id();
//
//		$license_last_check_date=$wpbackitup_license->get_license_last_check_date();
//		//error_log('Last License Check:' . $license_last_check_date->format('Y-m-d H:i:s'));
//
//		$now = new DateTime('now');//Get NOW
//		$yesterday = $now->modify('-1 day');//subtract a day
//		//error_log('Yesterday:' .$yesterday->format('Y-m-d H:i:s'));
//
//		//Validate License
//		//error_log('Check:' . ($license_last_check_date<$yesterday || $force_check?'true' :'false') );
//		if ($license_last_check_date<$yesterday || $force_check)
//		{
//			//error_log('Checking license...');
//			$wpbackitup_license->update_license_options($license_key,$license_product_id);
//		}
//	}


	/**
	 * Filter: Show messages when license is active
	 *
	 * @since    1.14.0
	 *
	 * @param $string
	 * @param $display_active
	 *
	 * @return string
	 */
	public function show_message_active_filter( $string, $display_active){

		$WPBackItUp_License = new WPBackItUp_License();

		if ( true === $WPBackItUp_License->is_license_active() && true === $display_active){
			return $string;
		}

		if ( true === $WPBackItUp_License->is_license_active() && false === $display_active){
			return '';
		}

		if ( false === $WPBackItUp_License->is_license_active() && false === $display_active){
			return $string;
		}

		if ( false === $WPBackItUp_License->is_license_active() && true === $display_active){
			return '';
		}

		return ''; 		//return empty string

	}

}
