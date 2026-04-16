const { onCall } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { MercadoPagoConfig, Preference } = require("mercadopago");

// 1. Llamamos al secreto que guardaste en tu terminal en el Paso 1
const mpAccessToken = defineSecret("MP_ACCESS_TOKEN");

// 2. Creamos la función que React va a llamar cuando el cliente presione "Pagar"
exports.createPreference = onCall({ secrets: [mpAccessToken] }, async (request) => {
    try {
        // Inicializamos Mercado Pago de forma segura (el secreto nunca baja al navegador)
        const client = new MercadoPagoConfig({ 
            accessToken: mpAccessToken.value(), 
            options: { timeout: 5000 } 
        });

        // Extraemos los datos que nos va a mandar tu App.jsx
        const { cart, deliveryCost, customerInfo } = request.data;

        // Transformamos tu carrito al formato estricto que exige MercadoPago
        const items = cart.map(item => ({
            title: `${item.quantity}x ${item.name}`, // Ej: 2x Vikinga
            unit_price: Number(item.price),
            quantity: Number(item.quantity),
            currency_id: "ARS",
        }));

        // Si hay costo de envío (Delivery), lo agregamos como un ítem más a la factura
        if (deliveryCost > 0) {
            items.push({
                title: "Costo de Envío 🛵",
                unit_price: Number(deliveryCost),
                quantity: 1,
                currency_id: "ARS",
            });
        }

        // Creamos la "Preferencia" (La intención de cobro)
        const preference = new Preference(client);
        const response = await preference.create({
            body: {
                items: items,
                payer: {
                    name: customerInfo.name,
                },
                // A dónde vuelve el cliente después de pagar
                back_urls: {
                    success: "https://contreburger.com/", 
                    failure: "https://contreburger.com/",
                    pending: "https://contreburger.com/"
                },
                auto_return: "approved",
            }
        });

        // Le devolvemos a React el link mágico de cobro
        return {
            id: response.id,
            init_point: response.init_point // Este es el link azul de MP
        };

    } catch (error) {
        console.error("Error fatal en MercadoPago:", error);
        throw new Error("No se pudo generar el link de pago");
    }
});