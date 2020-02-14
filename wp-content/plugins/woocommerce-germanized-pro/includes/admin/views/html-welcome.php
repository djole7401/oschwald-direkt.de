<?php
/**
 * Admin View: Generator Editor
 */

if ( ! defined( 'ABSPATH' ) )
	exit;

$upload_dir = WC_germanized_pro()->get_upload_dir();
$path = $upload_dir[ 'basedir' ];
$dirname = basename( $path );

?>

<div id="message" class="updated woocommerce-gzd-message wc-connect">

    <h3><?php _e( 'Thank you for Upgrading to WooCommerce Germanized Pro', 'woocommerce-germanized-pro' );?></h3>

    <p><?php printf( __( 'Congratulations. Your WooCommerce Germanized Pro installation was successful. To generate invoices please grant <a href="%s" target="_blank">writing permissions</a> to the following folder and it\'s subfolders:', 'woocommerce-germanized-pro' ), 'https://vendidero.de/dokument/dateirechte-fuer-das-rechnungsarchiv-vergeben' );?></p>
	<p><code>wp-content/uploads/<?php echo $dirname; ?></code></p>

    <h3><?php _e( 'Attention: NGINX Users', 'woocommerce-germanized' ); ?></h3>
    <p>Please make sure that the <code>wp-content/uploads/<?php echo $dirname; ?></code> folder is not readable from a URL. You should ask your Webhoster to support you protecting your files from being accessed directly.</p>

	<p><a class="button button-primary" href="<?php echo admin_url( 'admin.php?page=wc-settings&tab=germanized' );?>"><?php _e( 'Start configuration', 'woocommerce-germanized-pro' );?></a></p>
</div>