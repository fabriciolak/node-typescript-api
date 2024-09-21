import { ForecastPoint, StormGlass } from "@src/clients/stormGlass";
import { InternalError } from "@src/util/errors/internal-error";
import { Beach } from '@src/models/beach'

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[]
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint { }

export class ForecastInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`)
  }
}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) { }

  public async processForecastForBeaches(beaches: Beach[]): Promise<TimeForecast[]> {
    const pointsWithCorrectSources: BeachForecast[] = []

    try {
      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng)
        const enrichedBeachData = this.enrichedBeach(points, beach)
        pointsWithCorrectSources.push(...enrichedBeachData)
      }
      return this.mapForecastByTime(pointsWithCorrectSources)
    }
    catch (error) {
      throw new ForecastInternalError((error as Error).message)
    }
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = []

    for (const point of forecast) {
      const timePoint = forecastByTime.find((f) => f.time === point.time)
      if (timePoint) {
        timePoint.forecast.push(point)
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point]
        })
      }
    }

    return forecastByTime
  }

  private enrichedBeach(
    points: ForecastPoint[],
    beach: Beach
  ) {
    return points.map((e) => ({
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: 1
      },
      ...e,
    }))
  }
}