<?php if (!defined ('WPINC')) die('No direct access allowed');

/**
 * WPBackItUp Premium
 *
 * Backup plugin to create a full backup (files + database) that can be used to easily restore, duplicate,
 * clone, or migrate any WordPress website.
 *
 * @link              http://www.wpbackitup.com
 * @package           WPBackitup_Premium
 *
 * @wordpress-plugin
 * Plugin Name:       WP BackItUp Premium
 * Plugin URI:        http://www.wpbackitup.com
 * Description:       Backup & Restore your content, settings, themes, plugins and media in just a few simple clicks.
 * Version:           1.24.0
 * Author:            WPBackItUp
 * Author URI:        http://www.wpbackitup.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       wpbackitup-premium
 * Domain Path:       /languages
 */

define( 'WPBACKITUP_PREMIUM__PLUGIN_AUTHOR', 'WPBackItUp');
define( 'WPBACKITUP_PREMIUM__PLUGIN_NAME', 'WP BackItUp Premium');
define( 'WPBACKITUP_PREMIUM__ITEM_ID','679');

define( 'WPBACKITUP_PREMIUM__MAJOR_VERSION', 1);
define( 'WPBACKITUP_PREMIUM__MINOR_VERSION', 24);
define( 'WPBACKITUP_PREMIUM__MAINTENANCE_VERSION', 0); //Dont forget to update version in header on WP release
define( 'WPBACKITUP_PREMIUM__BUILD_VERSION', 0); //Used for hotfix releases
define( 'WPBACKITUP_PREMIUM__VERSION',sprintf("%d.%d.%d.%d", WPBACKITUP_PREMIUM__MAJOR_VERSION, WPBACKITUP_PREMIUM__MINOR_VERSION,WPBACKITUP_PREMIUM__MAINTENANCE_VERSION,WPBACKITUP_PREMIUM__BUILD_VERSION));

define( 'WPBACKITUP_PREMIUM__CE_MIN_VERSION', '1.26.0');
define( 'WPBACKITUP_PREMIUM__PHP_MIN_VERSION', '5.6');

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-wpbackitup-premium-activator.php
 */
function activate_wpbackitup_premium() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-wpbackitup-premium-activator.php';
	WPBackitup_Premium_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-wpbackitup-premium-deactivator.php
 */
function deactivate_wpbackitup_premium() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-wpbackitup-premium-deactivator.php';
	WPBackitup_Premium_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_wpbackitup_premium' );
register_deactivation_hook( __FILE__, 'deactivate_wpbackitup_premium' );

/**
 * Action: Display Dependency Admin Notices
 * Display only on WPBackItUp AND Plugins pages
 *
 * @since     1.0.0*
 *
 */
function wpbackitup_premium_dependency_notice() {
	global $pagenow;

	//Warnings Notices
	$warning_notices = wpbackitup_premium_check_warnings();
	$error_notices = wpbackitup_premium_check_dependencies();

	if (false !== $warning_notices || false !==$error_notices) {

		if ( $pagenow == 'plugins.php' || ( isset($_GET['page']) && false !== strpos($_GET['page'],'wp-backitup') ) ) {
			//Write the notices to the output buffer
			ob_start();

			//Warning Notices
			if( false !== $warning_notices && count($warning_notices)>0 ) { ?>
				<div class="notice notice-warning is-dismissible">
					<p><?php
						foreach ($warning_notices  as $notice ) {
							echo $notice .'<br/>';
						}
						?></p>
				</div>
				<?php
			}

			//Error Notices
			if( false !==$error_notices && count($error_notices)>0 ) { ?>
				<div class="notice notice-error is-dismissible">
					<p><?php
						foreach ( $error_notices as $notice ) {
							echo $notice . '<br/>';
						}
						?></p>
				</div>
				<?php
			}

			echo ob_get_clean();//flush the buffer
		}
	}
}
add_action('admin_notices', 'wpbackitup_premium_dependency_notice' );


/**
 * Check dependencies and create notices
 *
 * @return array|bool
 */
function wpbackitup_premium_check_dependencies() {
	$notices = array();

	//Check WPBackItUp Version
	if ( ! class_exists( 'WPBackItUp_Admin' )  || version_compare(WPBACKITUP__VERSION, WPBACKITUP_PREMIUM__CE_MIN_VERSION , '<') ) {
		$notices[] = sprintf( __( 'WPBackItUp Premium requires WPBackItUp Version %s or greater. Please install and activate the <a href="%s" target="_blank">WPBackItUp</a> Plugin', 'wp-wpbackitup-premium' ), WPBACKITUP_PREMIUM__CE_MIN_VERSION, 'https://wordpress.org/plugins/wp-backitup/');
	}

	if (count($notices)<=0) return false;
	else return $notices;
}

/**
 * Check dependencies and create notices
 *
 * @return array|bool
 */
function wpbackitup_premium_check_warnings() {
	$notices = array();

	if ( version_compare( PHP_VERSION, WPBACKITUP_PREMIUM__PHP_MIN_VERSION, '<' ) ) {
		$source=urlencode(WPBACKITUP_PREMIUM__PLUGIN_NAME);
		$medium='plugin';
		$campaign='php_version';
		$utm_url = 'https://www.wpbackitup.com/blog/wpbackitup-premium-php-version' .'/?utm_medium=' .$medium . '&utm_source=' .$source .'&utm_campaign=' .$campaign;
		$notices[] = sprintf( __( 'WPBackItUp Premium %s requires PHP Version %s or greater to receive further product updates.  Please see this %s for more info.', 'wp-wpbackitup' ),rtrim (WPBACKITUP_PREMIUM__VERSION,'.0'), WPBACKITUP_PREMIUM__PHP_MIN_VERSION ,sprintf( "<a href='%s' target='_blank'>%s</a>",$utm_url,__( 'post','wp-backitup')));
	}

	if (count($notices)<=0) return false;
	else return $notices;
}

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-wpbackitup-premium.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.14.0
 */
function wpbackitup_premium() {

	//Check dependencies before running
	if ( false === wpbackitup_premium_check_dependencies()) {
			$plugin = new WPBackitup_Premium( WPBACKITUP_PREMIUM__PLUGIN_NAME, WPBACKITUP_PREMIUM__PLUGIN_AUTHOR, __FILE__, WPBACKITUP_PREMIUM__VERSION );
			$plugin->run();
	}

}
add_action( 'plugins_loaded', 'wpbackitup_premium' );

