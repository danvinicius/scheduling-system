class AppointmentFactory {
  //Build que pega uma consulta simples e processa ela para retornar informações mais detalhadas de data e horário
  Build(simpleAppointment) {
    const day = simpleAppointment.date.getDate() + 1;
    const month = simpleAppointment.date.getMonth();
    const year = simpleAppointment.date.getFullYear();

    const hour = Number.parseInt(simpleAppointment.time.split(":")[0]);
    const minutes = Number.parseInt(simpleAppointment.time.split(":")[1]);

    const startDate = new Date(year, month, day, hour, minutes, 0, 0);

    const appo = {
      id: simpleAppointment._id,
      name: simpleAppointment.name,
      title: simpleAppointment.name + " - " + simpleAppointment.description,
      email: simpleAppointment.email,
      notified: simpleAppointment.notified,
      start: startDate,
      end: startDate,
    };

    return appo;
  }
}

module.exports = new AppointmentFactory();
