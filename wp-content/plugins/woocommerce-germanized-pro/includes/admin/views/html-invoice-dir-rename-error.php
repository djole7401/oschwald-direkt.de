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

<div id="message" class="error woocommerce-gzd-message wc-connect">

	<h3><?php _e( 'Invoice Directory Rename Failure', 'woocommerce-germanized-pro' );?></h3>

	<p><?php printf( __( 'For some reason we were unable to rename the invoice folder during the update of Germanized Pro. Please manually rename <code>%s</code> to <code>%s</code> to ensure compatibility. We have changed the directory name to improve security for nginx users.', 'woocommerce-germanized-pro' ), 'wp-content/uploads/wc-gzdp', 'wp-content/uploads/' . $dirname );?></p>

</div>