import { Hono } from "hono";
import { serve } from "@hono/node-server";
import pg from "pg";
import { serveStatic } from "@hono/node-server/serve-static";

const connectionString = process.env.DATABASE_URL;

const postgresql = connectionString
  ? new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false } })
  : new pg.Pool({ user: "postgres", password: "postgres" });

//Definere hva serveren skal gjøre
const app = new Hono();

//API - firestation. Hente fra database
app.get("/api/firestation", async (c) => {
  const result = await postgresql.query(`
    SELECT brannstasjon,
           ST_AsGeoJSON(ST_Transform(posisjon, 4326)) ::json AS geometry
    FROM brannstasjoner_4782fbf1d36849a5985a2b5594491155.brannstasjon;
  `);

  return c.json({
    type: "FeatureCollection",
    crs: {
      type: "name",
      properties: {
        name: "urn:ogc:def:crs:OGC:1.3:CRS84",
      },
    },
    features: result.rows.map((row: any) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: row.geometry.coordinates,
      },
      properties: {
        brannstasjon: row.brannstasjon,
        type: "firestation",
      },
    })),
  });
});

//API - civilDefenseDistricts. Hente fra database
app.get("/api/CivilDefenceDistricts", async (c) => {
  const result = await postgresql.query(`
    SELECT 
      navn AS navn,
      ST_AsGeoJSON(ST_Transform(omrade, 4326))::json AS geometry
    FROM
      sivilforsvarsdistrikter_6bd3ee92c25a4365bef3f19bde3ae508.sivilforsvarsdistrikt;
  `);

  return c.json({
    type: "FeatureCollection",
    crs: {
      type: "name",
      properties: {
        name: "urn:ogc:def:crs:OGC:1.3:CRS84",
      },
    },
    features: result.rows.map((row: any) => ({
      type: "Feature",
      geometry: row.geometry,
      properties: {
        navn: row.navn,
        type: "civil_defence",
      },
    })),
  });
});

//Henter json fra post 3000 (backend / server)
app.use("*", serveStatic({ root: "../dist/" }));

//Oppstarting av server på node
serve({
  fetch: app.fetch,
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
});

console.log("Server is running");
