<?php
/**
 * Single Product Price, including microdata for SEO
 *
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     2.7.0
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

global $post, $product;
?>

<div itemprop="offers" itemscope itemtype="http://schema.org/Offer">

    <p class="product_price price headerfont"><?php echo $product->get_price_html(); ?></p>

    <?php do_action( 'wc_gzdp_single_product_legal_price_info' ); ?>

    <meta itemprop="price" content="<?php echo esc_attr( function_exists( 'wc_get_price_to_display' ) ? wc_get_price_to_display( $product ) : $product->get_display_price() ); ?>" />
    <meta itemprop="priceCurrency" content="<?php echo esc_attr( get_woocommerce_currency() ); ?>" />
    <link itemprop="availability" href="http://schema.org/<?php echo $product->is_in_stock() ? 'InStock' : 'OutOfStock'; ?>" />

</div>