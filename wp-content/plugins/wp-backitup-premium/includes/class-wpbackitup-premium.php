<?php

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       http://www.wpbackitup.com
 * @since      1.14.0
 *
 * @package    WPBackitup_Premium
 * @subpackage WPBackitup_Premium/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.14.0
 * @package    WPBackitup_Premium
 * @subpackage WPBackitup_Premium/includes
 * @author     Chris Simmons <chris@wpbackitup.com>
 */
class WPBackitup_Premium {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.14.0
	 * @access   protected
	 * @var      WPBackitup_Premium_Loader $loader Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.14.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The plugin author
	 *
	 * @since    1.14.0
	 * @access   protected
	 * @var      string    $plugin_author  The string used to contain the plugin author
	 */
	protected $plugin_author;

	/**
	 * The path for the main plugin file
	 *
	 * @since    1.14.0
	 * @access   protected
	 * @var      string    $plugin_path    The path to the plugin file
	 */
	protected $plugin_path;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.14.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.14.0
	 *
	 * @param string $plugin_name       The name of this plugin.
	 * @param string $plugin_path       The path to the main plugin file
	 * @param string $plugin_version    The version of this plugin.
	 */
	public function __construct($plugin_name, $plugin_author,$plugin_path, $plugin_version) {

		$this->plugin_name = $plugin_name;
		$this->plugin_author=$plugin_author;
		$this->plugin_path = $plugin_path;
		$this->version = $plugin_version;


		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();
	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - WPBackitup_Premium_Loader. Orchestrates the hooks of the plugin.
	 * - WPBackitup_Premium_i18n. Defines internationalization functionality.
	 * - WPBackitup_Premium_Admin. Defines all hooks for the admin area.
	 * - Wpbackitup_Premium_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.14.0
	 * @access   private
	 */
	private function load_dependencies() {

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-wpbackitup-premium-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-wpbackitup-premium-i18N.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-wpbackitup-premium-admin.php';

		/**
		 * The EDD class responsible for defining Plugin Updates
		 */
		require_once( plugin_dir_path( dirname( __FILE__ ) )  . 'vendor/edd/wpbackitup-premium_EDD_SL_Plugin_Updater.php' );

		/**
		 * The class responsible for the restore
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-wpbackitup-premium-restore.php';

		/**
		 * The class responsible for Cron jobs
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-wpbackitup-premium-cron.php';


		/**
		 * The class responsible for Usage tracking
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-wpbackitup-premium-usage.php';


		$this->loader = new WPBackitup_Premium_Loader();

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the WPBackitup_Premium_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.14.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new WPBackitup_Premium_i18n();

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.14.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new WPBackitup_Premium_Admin( $this->get_plugin_name(), $this->get_plugin_path(), $this->get_version() );

		//add and reorder admin menu
		$this->loader->add_filter( 'custom_menu_order', $plugin_admin, 'reorder_menu' );

		//Filter content when premium active
		$this->loader->add_action( 'wpbackitup_show_active', $plugin_admin, 'show_message_active_filter', 10, 2 );

		//Actions
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );

		//Render Scheduler
		$this->loader->add_action( 'wpbackitup_render_advanced_scheduler', $plugin_admin, 'render_scheduler_html' );

		//Render Premium Settings
		$this->loader->add_action( 'wpbackitup_render_premium_settings', $plugin_admin, 'render_premium_settings' );

		//Render License Registration Form
		$this->loader->add_action( 'wpbackitup_render_license_registration_form', $plugin_admin, 'render_license_registration_form' );

	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.14.0
	 * @access   private
	 */
	private function define_public_hooks() {

		//No Public portion of the plugin

		//Load plugin updater action
		$this->loader->add_action( 'admin_init', $this, 'wpbackitup_plugin_updater', 0);

	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.14.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * Plugin Updater action
	 *
	 * @since    1.14.0
	 *
	 */
	function wpbackitup_plugin_updater() {
		//error_log('plugin-updater');

		$wpbackitup_license = new WPBackItUp_License();
		$license_active=$wpbackitup_license->is_license_active();
		//error_log('License Active:'.var_export($license_active,true));

		//TODO: Uncomment when 2.0 is released
		//Updates will not be supported for anyone running php 5.6+
//		if ( version_compare( PHP_VERSION, WPBACKITUP_PREMIUM__PHP_MIN_VERSION, '<' ) ) {
//			return;
//		}
		//Only update when license is active
		if (true===$license_active){
			$license_key = $wpbackitup_license->get_license_key();

			// setup the updater
			$edd_updater = new WPBackItup_EDD_SL_Plugin_Updater(
				WPBACKITUP__SECURESITE_URL,
				$this->plugin_path,
				array(
					'version'     => $this->get_version(),    // current version number
					'license'     => $license_key,      // license key (used get_option above to retrieve from DB)
					'item_name'   => $this->get_plugin_name(),// name of this plugin
					'author'      => $this->get_plugin_author(),   // author of this plugin
					'wp_override' => false,              // Override the WordPress.org repo
				)
			);
		}
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.14.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.14.0
	 * @return    WPBackitup_Premium_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.14.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

	/**
	 * Retrieve the plugin path
	 *
	 * @since     1.14.0
	 * @return string
	 */
	public function get_plugin_path() {
		return $this->plugin_path;
	}

	/**
	 * Retrieve the plugin author
	 * @return string
	 */
	public function get_plugin_author() {
		return $this->plugin_author;
	}

}
