import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 86400;

// 슬러그 → Search Console 사이트 URL 매핑
const SITE_MAP: Record<string, string> = {
  carelec:    "sc-domain:carelec.kr",
  fundfinpro: "sc-domain:fundfinpro.com",
  carprotax:  "sc-domain:carprotax.com",
  hospetpay:  "sc-domain:hospetpay.com",
  newsioo:    "sc-domain:newsioo.com",
  carpaypro:  "sc-domain:carpaypro.com",
};

function getDateRange(daysAgo: number, spanDays: number) {
  const end = new Date();
  end.setDate(end.getDate() - daysAgo);
  const start = new Date(end);
  start.setDate(start.getDate() - spanDays);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const siteSlug = searchParams.get("site") ?? "carelec";
  const SITE_URL = SITE_MAP[siteSlug];

  if (!SITE_URL) {
    return NextResponse.json({ error: `알 수 없는 사이트: ${siteSlug}` }, { status: 400 });
  }

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !privateKey) {
    return NextResponse.json({ error: "GOOGLE_SERVICE_ACCOUNT_EMAIL 및 GOOGLE_PRIVATE_KEY를 .env.local에 설정해주세요." }, { status: 500 });
  }

  try {
    const auth = new google.auth.JWT({
      email,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
    });

    const sc = google.searchconsole({ version: "v1", auth });
    // daysAgo: 3 → SC 데이터 처리 지연(2~3일) 감안해 완성된 데이터만 사용
    // spanDays: 90 → SC 웹 UI 기본값(3개월)과 동일하게
    const range = getDateRange(3, 90);

    const [dateRes, queryRes] = await Promise.all([
      sc.searchanalytics.query({
        siteUrl: SITE_URL,
        requestBody: { startDate: range.startDate, endDate: range.endDate, dimensions: ["date"], rowLimit: 90 },
      }),
      sc.searchanalytics.query({
        siteUrl: SITE_URL,
        requestBody: { startDate: range.startDate, endDate: range.endDate, dimensions: ["query"], rowLimit: 100 },
      }),
    ]);

    const rows = (dateRes.data.rows ?? [])
      .map((r) => ({
        date: (r.keys?.[0] ?? "") as string,
        clicks: r.clicks ?? 0,
        impressions: r.impressions ?? 0,
        ctr: r.ctr ?? 0,
        position: r.position ?? 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const keywords = (queryRes.data.rows ?? []).map((r) => ({
      query: (r.keys?.[0] ?? "") as string,
      clicks: r.clicks ?? 0,
      impressions: r.impressions ?? 0,
      ctr: r.ctr ?? 0,
      position: r.position ?? 0,
    }));

    const totalClicks = rows.reduce((s, d) => s + d.clicks, 0);
    const totalImpressions = rows.reduce((s, d) => s + d.impressions, 0);
    const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00";
    const avgPosition = rows.length > 0 ? (rows.reduce((s, d) => s + d.position, 0) / rows.length).toFixed(1) : "0.0";

    const prevRange = getDateRange(93, 90);
    const [prevRes, firstSeenRes] = await Promise.all([
      sc.searchanalytics.query({
        siteUrl: SITE_URL,
        requestBody: { startDate: prevRange.startDate, endDate: prevRange.endDate, dimensions: ["date"], rowLimit: 90 },
      }),
      // 2020-01-01부터 전체 조회 → 가장 오래된 날짜 = 구글이 처음 기록한 날
      sc.searchanalytics.query({
        siteUrl: SITE_URL,
        requestBody: { startDate: "2020-01-01", endDate: range.endDate, dimensions: ["date"], rowLimit: 1000 },
      }),
    ]);
    const prevRows = prevRes.data.rows ?? [];
    const prevClicks = prevRows.reduce((s, r) => s + (r.clicks ?? 0), 0);
    const prevImpressions = prevRows.reduce((s, r) => s + (r.impressions ?? 0), 0);

    const allDateRows = firstSeenRes.data.rows ?? [];
    const firstSeen = allDateRows.length > 0
      ? allDateRows.map((r) => r.keys?.[0] ?? "").sort()[0]
      : null;

    // 1페이지(10위 이내) 키워드 수
    const top10Count = keywords.filter((k) => k.position <= 10).length;

    // 이전 기간 키워드 (top10 비교용)
    const prevQueryRes = await sc.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: { startDate: prevRange.startDate, endDate: prevRange.endDate, dimensions: ["query"], rowLimit: 100 },
    });
    const prevTop10Count = (prevQueryRes.data.rows ?? []).filter((r) => (r.position ?? 99) <= 10).length;

    return NextResponse.json({
      rows, keywords,
      summary: { totalClicks, totalImpressions, avgCtr, avgPosition, startDate: range.startDate, endDate: range.endDate, prevClicks, prevImpressions, firstSeen, top10Count, prevTop10Count },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[Search Console API Error] site=${siteSlug}`, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
