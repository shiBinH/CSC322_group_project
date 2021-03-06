;
const express = require('express');
const router = express.Router({
	mergeParams: true
});


module.exports = (data) => {	
	
	const GET_ITEM_CONTROLLER = (req, res) => {
		
		const ITEM_ID = req.params.id;
		const ITEM_MANAGER = data.itemManager;
		const STORE = ITEM_MANAGER.Store;
		
		const config = {
			id: ITEM_ID,
			sellerInfo: true
		}
		
		STORE
			.getOne(config)
			.then( (result) => {
				if (result !== null) {
					
					res
						.status(200)
						.json(result)
						
				} else {
					
					res
						.status(204)
						.json(result)
					
				}
				
			})
		
	}
	
	
	const BUY_ITEM_CONTROLLER = (req, res) => {
		
		const ORDER_MANAGER = data.orderManager;
		const ITEM_MANAGER = data.itemManager;
		const STORE = ITEM_MANAGER.Store;
		const ITEM_ID = req.params.id;
		const ITEM = req.body.item;
		const BUYER_ID = req.body.buyer;
		
		let updatedItem = ITEM;
		updatedItem.status = 'order';
		
		const UPDATE_ITEM_CONFIG = {
			id: ITEM_ID,
			item: updatedItem
		}
		
		//	Change item.status from "good" to "order"
		STORE
			.update(UPDATE_ITEM_CONFIG)
			.then((results) => {
				
				const CREATE_PENDING_CONFIG = {
					data: {
						buyer: BUYER_ID,
						itemID: ITEM_ID,
						price: ITEM.price.current,
						seller: ITEM.seller,
						status: 'pending'
					}
				}
				
				//	Create a pending order
				ORDER_MANAGER
					.createPendingOrder(CREATE_PENDING_CONFIG)
					.then((result) => {
						
						res
							.status(200)
							.end()
						
					})
				
			})
			
		
	}
	
	const BID_ITEM_CONTROLLER = (req, res) => {
		
		const ORDER_MANAGER = data.orderManager;
		const ITEM_MANAGER = data.itemManager;
		const STORE = ITEM_MANAGER.Store;
		const ITEM_ID = req.params.id;
		const ITEM = req.body.item;
		const BUYER_ID = req.body.buyer;
		
		const GET_ITEM_CONFIG = {
			id: ITEM_ID
		}
		
		STORE
			.getOne(GET_ITEM_CONFIG)
			.then((item) => {
				
				const BID_AMOUNT = req.body.bid;
				
				let updatedItem = {
					... item,
					price: {
						min: item.price.min,
						max: item.price.max, 
						previous: item.price.current,
						current: BID_AMOUNT
					},
					buyer: BUYER_ID
				}
				
				const UPDATE_ITEM_CONFIG = {
					id: ITEM_ID,
					item: updatedItem
				}
				
				STORE
					.update(UPDATE_ITEM_CONFIG)
					.then((updatedItem) => {
						
						res
							.status(200)
							.json(updatedItem);
						
					})
				
			})
		
		
		
	}
	
	
	router.get('/', GET_ITEM_CONTROLLER);
	router.post('/buy', BUY_ITEM_CONTROLLER);
	router.post('/bid', BID_ITEM_CONTROLLER);
	
	return router;
	
}