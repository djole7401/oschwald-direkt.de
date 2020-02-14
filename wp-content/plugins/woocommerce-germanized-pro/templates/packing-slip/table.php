<?php
/**
 * Packing SLip Table
 *
 * @author 		Vendidero
 * @package 	WooCommerceGermanizedPro/Templates
 * @version     1.0
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

$totals = $invoice->totals;

$order = $invoice->get_order();

$total_width = $total_width - 5;
$columns = 2;
$first_width = $total_width * 0.8;
$total_width_left = $total_width - $first_width;
$column_width = $total_width_left;

?>

<?php if ( $invoice->get_static_pdf_text( 'before_table' ) ) : ?>
	<div class="static">
		<?php echo $invoice->get_static_pdf_text( 'before_table' ); ?>
	</div>
<?php endif; ?>

<?php do_action( 'woocommerce_gzdp_packing_slip_before_item_table', $invoice ); ?>

<table class="main">
	<thead>
		<tr class="header">
			<th class="first" width="<?php echo $first_width; ?>"><?php _e( 'Services', 'woocommerce-germanized-pro' ); ?></th>
			<th class="last" width="<?php echo $column_width; ?>"><?php _e( 'Quantity', 'woocommerce-germanized-pro' ); ?></th>
		</tr>
	</thead>
	<tbody>
		<?php if ( $invoice->items ) : ?>

			<?php foreach ( $invoice->items as $item_id => $item ) :

				$_product  = apply_filters( 'woocommerce_order_item_product', $order->get_product_from_item( $item ), $item );
				$item_meta_print = wc_gzdp_get_order_meta_print( $_product, $item );

			?>
				<tr class="data" nobr="true">
					<td class="first" width="<?php echo $first_width; ?>">
						<?php

						// Product name
						echo apply_filters( 'woocommerce_gzdp_invoice_item_name', ( is_object( $item ) ? $item->get_name() : $item['name'] ), $item, false );

						// SKU
						if ( $invoice->get_option( 'show_sku' ) === 'yes' && is_object( $_product ) && $_product->get_sku() ) {
							echo ' (#' . $_product->get_sku() . ')';
						}

						// allow other plugins to add additional product information here
						do_action( 'woocommerce_gzdp_packing_slip_item_meta_start', $item_id, $item, $order );

						if ( $invoice->get_option( 'show_variation_attributes' ) == 'yes' && ! empty( $item_meta_print ) ) {
							echo '<br/><small>' . $item_meta_print . '</small>';
						}

						?>

						<?php if ( $invoice->get_option( 'show_delivery_time' ) == 'yes' ) : $product_delivery_time = wc_gzd_cart_product_delivery_time( '', $item ); ?>

							<?php if ( ! empty( $product_delivery_time ) ) : ?>
                                <p><small><?php echo trim( strip_tags( $product_delivery_time ) ); ?></small></p>
							<?php endif; ?>

						<?php endif; ?>

						<?php if ( $invoice->get_option( 'show_product_units' ) == 'yes' ) : $product_units = wc_gzd_cart_product_units( '', $item ); ?>

							<?php if ( ! empty( $product_units ) ) : ?>
                                <p><small><?php echo strip_tags( $product_units ); ?></small></p>
							<?php endif; ?>

						<?php endif; ?>

						<?php if ( $invoice->get_option( 'show_item_desc' ) == 'yes' ) : $product_desc = wc_gzd_cart_product_item_desc( '', $item ); ?>

							<?php if ( ! empty( $product_desc ) ) : ?>
								<?php echo wpautop( $product_desc ); ?>
							<?php endif; ?>

						<?php endif; ?>

						<?php do_action( 'woocommerce_gzdp_packing_slip_after_column_name', $item, $invoice ); ?>
                    </td>
					<td class="last" width="<?php echo $column_width; ?>"><?php echo wc_gzdp_get_invoice_quantity( $item ); ?></td>
				</tr>
			<?php endforeach; ?>
		<?php endif; ?>
	</tbody>
</table>

<?php do_action( 'woocommerce_gzdp_packing_slip_after_item_table', $invoice ); ?>

<?php if ( $invoice->get_static_pdf_text( 'after_table' ) ) : ?>
	<div class="static">
		<?php echo $invoice->get_static_pdf_text( 'after_table' ); ?>
	</div>
<?php endif; ?>
